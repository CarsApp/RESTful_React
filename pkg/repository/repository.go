package repository

import (
	"github.com/CarsApp/RESTful_React/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(username, password string) (models.User, error)
}

type Repository struct {
	Authorization
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(pool),
	}
}
