package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/TodoApp2021/RESTful_React/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type TodoItemPostgres struct {
	pool *pgxpool.Pool
}

func NewTodoItemPostgres(pool *pgxpool.Pool) *TodoItemPostgres {
	return &TodoItemPostgres{pool: pool}
}

func (t *TodoItemPostgres) Create(listId int, item models.TodoItem) (int, error) {
	conn, err := t.pool.Acquire(context.Background())
	if err != nil {
		return -1, err
	}
	defer conn.Release()
	tx, err := conn.Begin(context.Background())
	if err != nil {
		return 0, err
	}

	var itemId int
	createItemQuery := fmt.Sprintf("INSERT INTO %s (title, description) values ($1, $2) RETURNING id", todoItemsTable)

	row := tx.QueryRow(context.Background(), createItemQuery, item.Title, item.Description)
	err = row.Scan(&itemId)
	if err != nil {
		if e := tx.Rollback(context.Background()); e != nil {
			return -1, err
		}
		return 0, err
	}

	createListItemsQuery := fmt.Sprintf("INSERT INTO %s (list_id, item_id) values ($1, $2)", listsItemsTable)
	_, err = tx.Exec(context.Background(), createListItemsQuery, listId, itemId)
	if err != nil {
		if e := tx.Rollback(context.Background()); e != nil {
			return -1, err
		}
		return 0, err
	}

	return itemId, tx.Commit(context.Background())
}

func (t *TodoItemPostgres) GetAll(userId, listId int) ([]models.TodoItem, error) {
	conn, err := t.pool.Acquire(context.Background())
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	var items []models.TodoItem
	query := fmt.Sprintf(`SELECT ti.id, ti.title, ti.description, ti.done FROM %s ti INNER JOIN %s li on li.item_id = ti.id
									INNER JOIN %s ul on ul.list_id = li.list_id WHERE li.list_id = $1 AND ul.user_id = $2`,
		todoItemsTable, listsItemsTable, usersListsTable)

	rows, err := conn.Query(context.Background(), query, listId, userId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		item := models.TodoItem{}
		if err = rows.Scan(&item.Id, &item.Title, &item.Description, &item.Done); err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	return items, nil
}

func (t *TodoItemPostgres) GetById(userId, itemId int) (models.TodoItem, error) {
	var item models.TodoItem

	conn, err := t.pool.Acquire(context.Background())
	if err != nil {
		return item, err
	}
	defer conn.Release()

	query := fmt.Sprintf(`SELECT ti.id, ti.title, ti.description, ti.done FROM %s ti INNER JOIN %s li on li.item_id = ti.id
									INNER JOIN %s ul on ul.list_id = li.list_id WHERE ti.id = $1 AND ul.user_id = $2`,
		todoItemsTable, listsItemsTable, usersListsTable)

	row := conn.QueryRow(context.Background(), query, itemId, userId)
	if err := row.Scan(&item.Id, &item.Title, &item.Description, &item.Done); err != nil {
		return item, err
	}

	return item, nil
}

func (t *TodoItemPostgres) Delete(userId, itemId int) error {
	conn, err := t.pool.Acquire(context.Background())
	if err != nil {
		return err
	}
	defer conn.Release()

	query := fmt.Sprintf(`DELETE FROM %s ti USING %s li, %s ul
									WHERE ti.id = li.item_id AND li.list_id = ul.list_id AND ul.user_id = $1 AND ti.id = $2`,
		todoItemsTable, listsItemsTable, usersListsTable)

	_, err = conn.Exec(context.Background(), query, userId, itemId)

	return err
}

func (t *TodoItemPostgres) Update(userId, itemId int, input models.UpdateItemInput) error {
	conn, err := t.pool.Acquire(context.Background())
	if err != nil {
		return err
	}
	defer conn.Release()

	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if input.Title != nil {
		setValues = append(setValues, fmt.Sprintf("title=$%d", argId))
		args = append(args, *input.Title)
		argId++
	}

	if input.Description != nil {
		setValues = append(setValues, fmt.Sprintf("description=$%d", argId))
		args = append(args, *input.Description)
		argId++
	}

	if input.Done != nil {
		setValues = append(setValues, fmt.Sprintf("done=$%d", argId))
		args = append(args, *input.Done)
		argId++
	}

	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf(`UPDATE %s ti SET %s FROM %s li, %s ul
									WHERE ti.id = li.item_id AND li.list_id = ul.list_id AND ul.user_id = $%d AND ti.id = $%d`,
		todoItemsTable, setQuery, listsItemsTable, usersListsTable, argId, argId+1)
	args = append(args, userId, itemId)

	_, err = conn.Exec(context.Background(), query, args...)
	return err
}
