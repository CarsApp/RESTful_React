package kafka

import (
	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Authorization interface {
	CreateUser(user models.User) error
}

type TodoList interface {
	Create(userId int, list models.TodoList) error
	Delete(userId, listId int) error
	Update(userId, listId int, input models.UpdateListInput) error
}

type TodoItem interface {
	Create(listId int, item models.TodoItem) error
	Delete(userId, itemId int) error
	Update(userId, itemId int, input models.UpdateItemInput) error
}

type KProducer struct {
	Authorization
	TodoList
	TodoItem
}

func NewKProducer(producer *kafka.Producer) *KProducer {
	return &KProducer{
		Authorization: NewAuthProducer(producer),
		TodoList:      NewTodoListsProducer(producer),
		TodoItem:      NewTodoItemsProducer(producer),
	}
}
