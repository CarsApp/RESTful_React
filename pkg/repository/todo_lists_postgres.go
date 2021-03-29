package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type TodoListPostgres struct {
	pool *pgxpool.Pool
}

func NewTodoListPostgres(pool *pgxpool.Pool) *TodoListPostgres {
	return &TodoListPostgres{pool: pool}
}

func (t *TodoListPostgres) Create(userId int, list models.TodoList) (int, error) {
	ctx := context.Background()
	conn, err := t.pool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Release()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return 0, err
	}

	var id int
	createListQuery := fmt.Sprintf("INSERT INTO %s (title, description) VALUES ($1, $2) RETURNING id", todoListsTable)
	row := tx.QueryRow(ctx, createListQuery, list.Title, list.Description)
	if err := row.Scan(&id); err != nil {
		if e := tx.Rollback(ctx); e != nil {
			return 0, err
		}
		return 0, err
	}

	createUsersListQuery := fmt.Sprintf("INSERT INTO %s (user_id, list_id) VALUES ($1, $2)", usersListsTable)
	_, err = tx.Exec(ctx, createUsersListQuery, userId, id)
	if err != nil {
		if e := tx.Rollback(ctx); e != nil {
			return 0, err
		}
		return 0, err
	}

	return id, tx.Commit(ctx)
}

func (t *TodoListPostgres) GetAll(userId int, limit, offset string) ([]models.TodoList, int, error) {
	ctx := context.Background()
	conn, err := t.pool.Acquire(ctx)
	if err != nil {
		return nil, 0, err
	}
	defer conn.Release()

	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	args = append(args, userId)
	argId := 2

	if limit != "" {
		setValues = append(setValues, fmt.Sprintf("LIMIT $%d", argId))
		args = append(args, limit)
		argId++
	}

	if offset != "" {
		setValues = append(setValues, fmt.Sprintf("OFFSET $%d", argId))
		args = append(args, offset)
	}

	setQuery := strings.Join(setValues, " ")

	lists := make([]models.TodoList, 0)
	count := 0
	// limit offset
	query := fmt.Sprintf("SELECT tl.id, tl.title, tl.description FROM %s tl INNER JOIN %s ul on tl.id = ul.list_id WHERE ul.user_id = $1 %s",
		todoListsTable, usersListsTable, setQuery)
	queryCount := fmt.Sprintf(
		"SELECT COUNT(*) FROM (SELECT tl.id, tl.title, tl.description FROM %s tl INNER JOIN %s ul on tl.id = ul.list_id WHERE ul.user_id = $1 ORDER BY tl.id) as t",
		todoListsTable, usersListsTable)
	row := conn.QueryRow(ctx, queryCount, userId)
	if err := row.Scan(&count); err != nil {
		return nil, 0, err
	}
	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}

	for rows.Next() {
		list := models.TodoList{}
		if err = rows.Scan(&list.Id, &list.Title, &list.Description); err != nil {
			return nil, 0, err
		}

		lists = append(lists, list)
	}

	return lists, count, nil
}

func (t *TodoListPostgres) GetById(userId, listId int) (models.TodoList, error) {
	ctx := context.Background()
	var list models.TodoList
	conn, err := t.pool.Acquire(ctx)
	if err != nil {
		return list, err
	}
	defer conn.Release()

	query := fmt.Sprintf(`SELECT tl.id, tl.title, tl.description FROM %s tl
								INNER JOIN %s ul on tl.id = ul.list_id WHERE ul.user_id = $1 AND ul.list_id = $2`,
		todoListsTable, usersListsTable)

	row := conn.QueryRow(ctx, query, userId, listId)
	if err := row.Scan(&list.Id, &list.Title, &list.Description); err != nil {
		return list, err
	}

	return list, nil
}

func (t *TodoListPostgres) Delete(userId, listId int) error {
	ctx := context.Background()
	conn, err := t.pool.Acquire(ctx)
	if err != nil {
		return err
	}
	defer conn.Release()

	query := fmt.Sprintf("DELETE FROM %s tl USING %s ul WHERE tl.id = ul.list_id AND ul.user_id=$1 AND ul.list_id=$2",
		todoListsTable, usersListsTable)

	_, err = conn.Exec(ctx, query, userId, listId)

	return err
}

func (t *TodoListPostgres) Update(userId, listId int, input models.UpdateListInput) error {
	ctx := context.Background()
	conn, err := t.pool.Acquire(ctx)
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

	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf("UPDATE %s tl SET %s FROM %s ul WHERE tl.id = ul.list_id AND ul.list_id=$%d AND ul.user_id=$%d",
		todoListsTable, setQuery, usersListsTable, argId, argId+1)
	args = append(args, listId, userId)

	_, err = conn.Exec(ctx, query, args...)
	return err
}
