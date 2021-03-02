package kafka

import "github.com/segmentio/kafka-go"

type KafkaClient struct {
	Kclient kafka.Client
}
