package repository

import (
	"context"
	"fmt"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/jackc/pgx/v4/pgxpool"
)

type AuthPostgres struct {
	pool *pgxpool.Pool
}

func NewAuthPostgres(pool *pgxpool.Pool) *AuthPostgres {
	return &AuthPostgres{pool: pool}
}

func (ap *AuthPostgres) CreateUser(user models.User) (int, error) {
	ctx := context.Background()
	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash) VALUES ($1, $2, $3) RETURNING id", usersTable)

	conn, err := ap.pool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Release()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return 0, err
	}

	row := tx.QueryRow(ctx, query, user.Name, user.Username, user.Password)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, tx.Commit(ctx)
}

func (ap *AuthPostgres) GetUser(username, password string) (models.User, error) {
	ctx := context.Background()
	var user models.User
	query := fmt.Sprintf("SELECT id, name, username, password_hash FROM %s WHERE username=$1 AND password_hash=$2", usersTable)

	conn, err := ap.pool.Acquire(ctx)
	if err != nil {
		return user, err
	}
	defer conn.Release()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return user, err
	}

	row := tx.QueryRow(ctx, query, username, password)
	if err := row.Scan(&user.Id, &user.Name, &user.Username, &user.Password); err != nil {
		return user, err
	}

	return user, tx.Commit(ctx)
}
