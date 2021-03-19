package handler

import (
	"net/http"
	"strconv"

	"github.com/TodoApp2021/gorestreact/pkg/models"
	"github.com/gin-gonic/gin"
)

// @Summary Create ToDo list
// @Security ApiKeyAuth
// @Tags lists
// @Description Create ToDo list
// @ID create-list
// @Accept  json
// @Produce  json
// @Param input body models.TodoList true "list info"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /api/lists [post]
func (h *Handler) createList(c *gin.Context) {
	userId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	var input models.TodoList
	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	id, err := h.services.TodoList.Create(userId, input)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type getAllListsResponse struct {
	Count int               `json:"count"`
	Data  []models.TodoList `json:"data"`
}

// @Summary Get All Lists ToDo
// @Security ApiKeyAuth
// @Tags lists
// @Description Get all lists ToDo
// @ID get-all-lists
// @Accept  json
// @Produce  json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} getAllListsResponse
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /api/lists [get]
func (h *Handler) getAllLists(c *gin.Context) {
	var limit, offset string

	limit = c.Query("limit")
	if limit != "" {
		if l, err := strconv.Atoi(limit); err != nil || l < 1 {
			newErrorResponse(c, http.StatusBadRequest, "invalid limit query")
			return
		}
	}

	offset = c.Query("offset")
	if offset != "" {
		if limit == "" {
			newErrorResponse(c, http.StatusBadRequest, "incorrect query")
			return
		}
		if l, err := strconv.Atoi(offset); err != nil || l < 0 {
			newErrorResponse(c, http.StatusBadRequest, "invalid offset query")
			return
		}
	}

	userId, err := getUserId(c)
	if err != nil {
		return
	}

	lists, count, err := h.services.TodoList.GetAll(userId, limit, offset)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllListsResponse{
		Count: count,
		Data:  lists,
	})
}

// @Summary Get list ToDo by id
// @Security ApiKeyAuth
// @Tags lists
// @Description Get list ToDo by id
// @ID get-list-by-id
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Success 200 {object} models.ListsItem
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /api/lists/{id} [get]
func (h *Handler) getListById(c *gin.Context) {
	userId, err := getUserId(c)
	if err != nil {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	list, err := h.services.TodoList.GetById(userId, id)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, list)
}

// @Summary Update list ToDo by id
// @Security ApiKeyAuth
// @Tags lists
// @Description Update list ToDo by id
// @ID update-list-by-id
// @Accept  json
// @Produce  json
// @Param id path int true "List ID"
// @Param input body models.UpdateListInput true "update list info"
// @Success 200 {object} statusResponse
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /api/lists/{id} [put]
func (h *Handler) updateList(c *gin.Context) {
	userId, err := getUserId(c)
	if err != nil {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	var input models.UpdateListInput
	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.TodoList.Update(userId, id, input); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "ok"})
}

// @Summary Delete list ToDo by id
// @Security ApiKeyAuth
// @Tags lists
// @Description Delete list ToDo by id
// @ID delete-list-by-id
// @Accept  json
// @Produce  json
// @Param id path int true "List ID"
// @Success 200 {object} statusResponse
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /api/lists/{id} [delete]
func (h *Handler) deleteList(c *gin.Context) {
	userId, err := getUserId(c)
	if err != nil {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	err = h.services.TodoList.Delete(userId, id)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{
		Status: "ok",
	})
}
