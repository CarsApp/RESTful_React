package kafka

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type TodoListsProducer struct {
	producer *kafka.Producer
	topic    *string
}

func NewTodoListsProducer(producer *kafka.Producer) *TodoListsProducer {
	topic := "todo_list"
	return &TodoListsProducer{producer: producer, topic: &topic}
}

func (tlp *TodoListsProducer) Create(userId int, list models.TodoList) error {
	_json := map[string]interface{}{
		"status":  "create",
		"user_id": userId,
		"item":    list,
	}

	valueJSON, err := json.Marshal(_json)
	if err != nil {
		return err
	}

	err = tlp.producer.Produce(&kafka.Message{
		Key:   []byte(fmt.Sprint(time.Now().UTC())),
		Value: valueJSON,
		TopicPartition: kafka.TopicPartition{
			Topic:     tlp.topic,
			Partition: 0, // partition number 0
		},
	}, nil)
	if err != nil {
		return err
	}

	return nil
}

func (tlp *TodoListsProducer) Delete(userId, listId int) error {
	_json := map[string]interface{}{
		"status":  "delete",
		"user_id": userId,
		"list_id": listId,
	}

	valueJSON, err := json.Marshal(_json)
	if err != nil {
		return err
	}

	err = tlp.producer.Produce(&kafka.Message{
		Key:   []byte(fmt.Sprint(time.Now().UTC())),
		Value: valueJSON,
		TopicPartition: kafka.TopicPartition{
			Topic:     tlp.topic,
			Partition: 1, // partition number 1
		},
	}, nil)
	if err != nil {
		return err
	}

	return nil
}

func (tlp *TodoListsProducer) Update(userId, listId int, input models.UpdateListInput) error {
	_json := map[string]interface{}{
		"status":  "update",
		"user_id": userId,
		"list_id": listId,
		"item":    input,
	}

	valueJSON, err := json.Marshal(_json)
	if err != nil {
		return err
	}

	err = tlp.producer.Produce(&kafka.Message{
		Key:   []byte(fmt.Sprint(time.Now().UTC())),
		Value: valueJSON,
		TopicPartition: kafka.TopicPartition{
			Topic:     tlp.topic,
			Partition: 2, // partition number 2
		},
	}, nil)
	if err != nil {
		return err
	}

	return nil
}
