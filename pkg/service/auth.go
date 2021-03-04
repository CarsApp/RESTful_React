package service

import (
	"crypto/sha1"
	"errors"
	"fmt"
	"time"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/TodoApp2021/gorestreact/pkg/repository"
	"github.com/dgrijalva/jwt-go"
)

const (
	SALT         = "saltcode"
	SIGNING_KEY  = "SecretKey"
	TWELVE_HOURS = 12 * time.Hour
)

type tokenClaims struct {
	jwt.StandardClaims
	UserId int `json:"user_id"`
}

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (as *AuthService) CreateUser(user models.User) (int, error) {
	hashPassword, err := generatePasswordHash(user.Password)
	if err != nil {
		return 0, err
	}

	user.Password = hashPassword
	return as.repo.CreateUser(user)
}

func (as *AuthService) GenerateToken(username, password string) (string, error) {
	hashPassword, err := generatePasswordHash(password)
	if err != nil {
		return "", err
	}

	user, err := as.repo.GetUser(username, hashPassword)
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(TWELVE_HOURS).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		user.Id,
	})

	return token.SignedString([]byte(SIGNING_KEY))
}

func (as *AuthService) ParseToken(accessToken string) (int, error) {
	operation := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(SIGNING_KEY), nil
	}

	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, operation)
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return 0, errors.New("token claims aren't of type")
	}

	return claims.UserId, nil
}

func generatePasswordHash(password string) (string, error) {
	hash := sha1.New()
	if _, err := hash.Write([]byte(password)); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", hash.Sum([]byte(SALT))), nil
}
