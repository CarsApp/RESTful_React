package repository

import (
	"context"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/jackc/tern/migrate"
	"github.com/sirupsen/logrus"
)

const (
	usersTable = "users"
)

type Config struct {
	DB_URL string
}

func NewPostgresDB(cfg Config) (*pgxpool.Pool, error) {
	pool, err := pgxpool.Connect(context.Background(), cfg.DB_URL)
	if err != nil {
		return nil, err
	}
	logrus.Info("Connected to DB!")

	conn, err := pool.Acquire(context.Background())
	if err != nil {
		return nil, err
	}

	if err := migrateDatabase(conn.Conn()); err != nil {
		return nil, err
	}

	defer conn.Release()

	return pool, nil
}

func migrateDatabase(conn *pgx.Conn) error {
	migrator, err := migrate.NewMigrator(context.Background(), conn, "version")
	if err != nil {
		return err
	}

	err = migrator.LoadMigrations("migrations")
	if err != nil {
		return err
	}

	err = migrator.Migrate(context.Background())
	if err != nil {
		return err
	}

	ver, err := migrator.GetCurrentVersion(context.Background())
	if err != nil {
		return err
	}
	logrus.Infof("Migrate done. Current version: %v\n", ver)

	return nil
}
