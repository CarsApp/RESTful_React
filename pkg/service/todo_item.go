package service

import (
	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/TodoApp2021/gorestreact/pkg/repository"
)

type TodoItemService struct {
	itemRepo repository.TodoItem
	listRepo repository.TodoList
}

func NewTodoItemService(itemRepo repository.TodoItem, listRepo repository.TodoList) *TodoItemService {
	return &TodoItemService{itemRepo: itemRepo, listRepo: listRepo}
}

func (s *TodoItemService) Create(userId, listId int, item models.TodoItem) (int, error) {
	_, err := s.listRepo.GetById(userId, listId)
	if err != nil {
		// list does not exists or does not belongs to user
		return 0, err
	}

	return s.itemRepo.Create(listId, item)
}

func (s *TodoItemService) GetAll(userId, listId int) ([]models.TodoItem, error) {
	return s.itemRepo.GetAll(userId, listId)
}

func (s *TodoItemService) GetById(userId, itemId int) (models.TodoItem, error) {
	return s.itemRepo.GetById(userId, itemId)
}

func (s *TodoItemService) Delete(userId, itemId int) error {
	return s.itemRepo.Delete(userId, itemId)
}

func (s *TodoItemService) Update(userId, itemId int, input models.UpdateItemInput) error {
	return s.itemRepo.Update(userId, itemId, input)
}
