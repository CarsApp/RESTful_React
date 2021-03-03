package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/TodoApp2021/go-rest-react/pkg/handler"
	"github.com/TodoApp2021/go-rest-react/pkg/repository"
	"github.com/TodoApp2021/go-rest-react/pkg/server"
	"github.com/TodoApp2021/go-rest-react/pkg/service"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// @title ToDo App 2021
// @version Beta
// @description RESTful API.

// @host localhost:8000
// @BasePath /

// @securityDefinitions.apikey ApiKeyAuth
// @in Header
// @name Authorization

func main() {
	if err := initConfig(); err != nil {
		logrus.Fatalf("error initializing configs: %s", err.Error())
	}

	poolDB, err := repository.NewPostgresDB(repository.Config{
		DB_URL: viper.GetString("db.url"),
	})
	if err != nil {
		logrus.Fatalf("failed to initialize db: %s", err.Error())
	}

	repos := repository.NewRepository(poolDB)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	srv := new(server.Server)
	go func() {
		if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
			if err == http.ErrServerClosed {
				logrus.Infof("Server closed under request: %v", err)
			} else {
				logrus.Fatalf("error occured while running http server: %s", err.Error())
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	poolDB.Close()
	logrus.Print("Closed Pool DB")
	if err := srv.Shutdown(context.TODO()); err != nil {
		log.Fatalf("Server Shutdown Failed: %+v", err)
	}
	logrus.Print("Gracefool shutdown")
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
