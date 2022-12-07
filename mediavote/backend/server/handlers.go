package server

import "github.com/labstack/echo/v4"

func (s *Server) Register(c echo.Context) error {
	_, session, err := s.AuthService.NewVoter(c.Request().Context(), c.FormValue("name"))
	if err != nil {
		return apiError(c, err)
	}
	c.SetCookie(newCookie(session))
	return c.JSON(200, map[string]any{})
}

func (s *Server) Login(c echo.Context) error {
	_, session, err := s.AuthService.LoginVoter(c.Request().Context(), c.FormValue("name"), c.FormValue("pin"))
	if err != nil {
		return apiError(c, err)
	}
	c.SetCookie(newCookie(session))
	return c.JSON(200, map[string]any{})
}

func apiError(c echo.Context, err error) error {
	return c.JSON(200, map[string]any{
		"errors": []any{
			map[string]any{
				"message": err.Error(),
			},
		},
	})
}
