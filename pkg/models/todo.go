package models

import "errors"

type TodoList struct {
	Id          int    `json:"id" db:"id" swaggerignore:"true"`
	Title       string `json:"title" db:"title" binding:"required" example:"Омлет"`
	Description string `json:"description" db:"description" example:"Список продуктов для приготовления омлета"`
}

type UsersList struct {
	Id     int
	UserId int
	ListId int
}

type TodoItem struct {
	Id          int    `json:"id" db:"id" swaggerignore:"true"`
	Title       string `json:"title" db:"title" binding:"required" example:"Купить яйцо"`
	Description string `json:"description" db:"description" example:"Купить 2 десятка 'Полтава'"`
	Done        bool   `json:"done" db:"done" example:"false"`
}

type ListsItem struct {
	Id     int
	ListId int
	ItemId int
}

type UpdateListInput struct {
	Title       *string `json:"title" example:"Картошка фри"`
	Description *string `json:"description" example:"Купить ингредиенты для картошки фри"`
}

func (i UpdateListInput) Validate() error {
	if i.Title == nil && i.Description == nil {
		return errors.New("update structure has no values")
	}

	return nil
}

type UpdateItemInput struct {
	Title       *string `json:"title" example:"Купить картошку"`
	Description *string `json:"description" example:"Купить молодую, не крупную картошку"`
	Done        *bool   `json:"done" example:"false"`
}

func (i UpdateItemInput) Validate() error {
	if i.Title == nil && i.Description == nil && i.Done == nil {
		return errors.New("update structure has no values")
	}

	return nil
}
