package repository

import (
	"github.com/TodoApp2021/RESTful_React/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(username, password string) (models.User, error)
}

type TodoList interface {
	Create(userId int, list models.TodoList) (int, error)
	GetAll(userId int) ([]models.TodoList, error)
	GetById(userId, listId int) (models.TodoList, error)
	Delete(userId, listId int) error
	Update(userId, listId int, input models.UpdateListInput) error
}

type TodoItem interface {
	Create(listId int, item models.TodoItem) (int, error)
	GetAll(userId, listId int) ([]models.TodoItem, error)
	GetById(userId, itemId int) (models.TodoItem, error)
	Delete(userId, itemId int) error
	Update(userId, itemId int, input models.UpdateItemInput) error
}

type Repository struct {
	Authorization
	TodoList
	TodoItem
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(pool),
		TodoList:      NewTodoListPostgres(pool),
		TodoItem:      NewTodoItemPostgres(pool),
	}
}
