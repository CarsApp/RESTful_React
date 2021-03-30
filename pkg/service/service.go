package service

import (
	"github.com/TodoApp2021/gorestreact/pkg/kafka"
	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/TodoApp2021/gorestreact/pkg/repository"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, error)
}

type TodoList interface {
	Create(userId int, list models.TodoList) error
	GetAll(userId int, limit, offset string) ([]models.TodoList, int, error)
	GetById(userId, listId int) (models.TodoList, error)
	Delete(userId, listId int) error
	Update(userId, listId int, input models.UpdateListInput) error
}

type TodoItem interface {
	Create(userId, listId int, item models.TodoItem) error
	GetAll(userId, listId int) ([]models.TodoItem, error)
	GetById(userId, itemId int) (models.TodoItem, error)
	Delete(userId, itemId int) error
	Update(userId, itemId int, input models.UpdateItemInput) error
}

type Service struct {
	Authorization
	TodoList
	TodoItem
}

func NewService(repos *repository.Repository, producer *kafka.KProducer) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization, producer.Authorization),
		TodoList:      NewTodoListService(repos.TodoList, producer.TodoList),
		TodoItem:      NewTodoItemService(repos.TodoItem, repos.TodoList, producer.TodoItem),
	}
}
