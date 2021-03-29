package kafka

import "github.com/confluentinc/confluent-kafka-go/kafka"

type Config struct {
	Url string
}

func NewProducerKafka(config Config) (*kafka.Producer, error) {
	configMap := kafka.ConfigMap{
		"bootstrap.servers": config.Url,
	}

	producer, err := kafka.NewProducer(&configMap)
	if err != nil {
		return nil, err
	}

	return producer, nil
}
