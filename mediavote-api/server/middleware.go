package server

import (
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
)

func CORS() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOriginFunc: func(origin string) (bool, error) {
			return strings.Contains(origin, "crows.moe") || strings.Contains(origin, "crows.local"), nil
		},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowHeaders: []string{
			echo.HeaderAccept,
			echo.HeaderAcceptEncoding,
			echo.HeaderContentType,
			echo.HeaderContentLength,
			echo.HeaderConnection,
		},
		MaxAge:           86400,
		AllowCredentials: true,
	})
}

const (
	SessionCookieName = "__session"
	CookieExpires     = 30 * 24 * time.Hour
)

func newCookie(session *entity.Session) *http.Cookie {
	domain := "crows.local"
	if env.IsProd() {
		domain = "crows.moe"
	}
	return &http.Cookie{
		Name:     SessionCookieName,
		Value:    session.Key,
		Domain:   domain,
		Path:     "/",
		Expires:  time.Now().Add(CookieExpires),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	}
}

func RequireStage(stage entity.Stage) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			year, err := service.GetCurrentYear(c.Request().Context())
			if err != nil {
				return err
			}
			if year.Stage() != stage {
				return terror.NotInStage(stage.String())
			}
			return next(c)
		}
	}
}
