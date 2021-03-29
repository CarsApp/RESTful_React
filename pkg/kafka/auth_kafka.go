package kafka

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type AuthProducer struct {
	producer *kafka.Producer
	topic    *string
}

func NewAuthProducer(producer *kafka.Producer) *AuthProducer {
	topic := "auth"
	return &AuthProducer{producer: producer, topic: &topic}
}

func (ap *AuthProducer) CreateUser(user models.User) error {
	_json := map[string]interface{}{
		"status": "create",
		"item":   user,
	}

	valueJSON, err := json.Marshal(_json)
	if err != nil {
		return err
	}

	err = ap.producer.Produce(&kafka.Message{
		Key:   []byte(fmt.Sprint(time.Now().UTC())),
		Value: valueJSON,
		TopicPartition: kafka.TopicPartition{
			Topic:     ap.topic,
			Partition: 0, // partition number 0
		},
	}, nil)
	if err != nil {
		return err
	}

	return nil
}
