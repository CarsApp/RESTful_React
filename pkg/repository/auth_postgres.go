package repository

import (
	"context"
	"fmt"

	"github.com/CarsApp/RESTful_React/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type AuthPostgres struct {
	pool *pgxpool.Pool
}

func NewAuthPostgres(pool *pgxpool.Pool) *AuthPostgres {
	return &AuthPostgres{pool: pool}
}

func (ap *AuthPostgres) CreateUser(user models.User) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash) VALUES ($1, $2, $3) RETURNING id", usersTable)

	conn, err := ap.pool.Acquire(context.Background())
	if err != nil {
		return -1, err
	}
	defer conn.Release()

	tx, err := conn.Begin(context.Background())
	if err != nil {
		return -1, err
	}

	row := tx.QueryRow(context.Background(), query, user.Name, user.Username, user.Password)
	if err := row.Scan(&id); err != nil {
		return -1, err
	}

	return id, tx.Commit(context.Background())
}

func (ap *AuthPostgres) GetUser(username, password string) (models.User, error) {
	var user models.User
	query := fmt.Sprintf("SELECT id, name, username, password_hash FROM %s WHERE username=$1 AND password_hash=$2", usersTable)

	conn, err := ap.pool.Acquire(context.Background())
	if err != nil {
		return user, err
	}
	defer conn.Release()

	tx, err := conn.Begin(context.Background())
	if err != nil {
		return user, err
	}

	row := tx.QueryRow(context.Background(), query, username, password)
	if err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Password); err != nil {
		return user, err
	}

	return user, tx.Commit(context.Background())
}
