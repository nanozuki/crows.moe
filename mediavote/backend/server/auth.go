package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/env"
)

const (
	SessionCookieName = "sessionid"
	APIKeyHeader      = "X-API-KEY"
)

func newCookie(session *entity.Session) *http.Cookie {
	return &http.Cookie{
		Name:     SessionCookieName,
		Value:    session.ID.String(),
		Path:     "/",
		Expires:  session.ExpireAt,
		Secure:   env.IsProd(),
		HttpOnly: true,
	}
}

func (s *Server) loadCtxUser(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var ctxUser *entity.CtxUser
		if key := c.Request().Header.Get(APIKeyHeader); key == env.AdminKey() {
			ctxUser = &entity.CtxUser{IsAdmin: true}
		} else {
			ctxUser = s.getCtxUserByCookie(c)
		}
		ctx := ctxUser.SetCtx(c.Request().Context())
		c.SetRequest(c.Request().WithContext(ctx))
		return next(c)
	}
}

func (s *Server) getCtxUserByCookie(c echo.Context) *entity.CtxUser {
	sessionCookie, err := c.Cookie(SessionCookieName)
	if err != nil || sessionCookie.Value == "" {
		return &entity.CtxUser{}
	}
	session, err := s.AuthService.GetSession(c.Request().Context(), sessionCookie.Value)
	if err != nil {
		return &entity.CtxUser{}
	}
	return entity.NewFromSession(session)
}
