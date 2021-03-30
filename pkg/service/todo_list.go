package service

import (
	"github.com/TodoApp2021/gorestreact/pkg/kafka"
	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/TodoApp2021/gorestreact/pkg/repository"
)

type TodoListService struct {
	repo     repository.TodoList
	producer kafka.TodoList // TODO
}

func NewTodoListService(repo repository.TodoList, producer kafka.TodoList) *TodoListService {
	return &TodoListService{repo: repo, producer: producer}
}

func (s *TodoListService) Create(userId int, list models.TodoList) error {
	// return s.repo.Create(userId, list) // to postgres sql
	return s.producer.Create(userId, list) // to kafka
}

func (s *TodoListService) GetAll(userId int, limit, offset string) ([]models.TodoList, int, error) {
	return s.repo.GetAll(userId, limit, offset)
}

func (s *TodoListService) GetById(userId, listId int) (models.TodoList, error) {
	return s.repo.GetById(userId, listId)
}

func (s *TodoListService) Delete(userId, listId int) error {
	// return s.repo.Delete(userId, listId) // to postgres sql
	return s.producer.Delete(userId, listId) // to kafka
}

func (s *TodoListService) Update(userId, listId int, input models.UpdateListInput) error {
	if err := input.Validate(); err != nil {
		return err
	}

	// return s.repo.Update(userId, listId, input) // to postgres sql
	return s.producer.Update(userId, listId, input) // to kafka
}
