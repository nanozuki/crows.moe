package server

import (
	"github.com/labstack/echo/v4"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

func (s *Server) Register(c echo.Context) error {
	_, session, err := s.AuthService.NewVoter(c.Request().Context(), c.FormValue("name"))
	if err != nil {
		return errResponse(c, err)
	}
	c.SetCookie(newCookie(session))
	return c.JSON(200, map[string]any{})
}

func (s *Server) Login(c echo.Context) error {
	_, session, err := s.AuthService.LoginVoter(c.Request().Context(), c.FormValue("name"), c.FormValue("pin"))
	if err != nil {
		return errResponse(c, err)
	}
	c.SetCookie(newCookie(session))
	return c.JSON(200, map[string]any{})
}

type apiError struct {
	Errors []*apiErrorEntry `json:"errors,omitempty"`
}

type apiErrorEntry struct {
	Message    string `json:"message,omitempty"`
	Extensions ierr.F `json:"extensions,omitempty"`
}

func newAPIErrorEntry(err error) *apiErrorEntry {
	e, ok := err.(*ierr.Error)
	if !ok {
		e = ierr.InternalServerError(err)
	}
	return &apiErrorEntry{
		Message:    e.Error(),
		Extensions: e.Fields.Set("origin", e.Origin.Error()),
	}
}

func errResponse(c echo.Context, err error) error {
	return c.JSON(200, &apiError{Errors: []*apiErrorEntry{newAPIErrorEntry(err)}})
}
