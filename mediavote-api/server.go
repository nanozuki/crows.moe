package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	"github.com/nanozuki/crows.moe/mediavote-api/service"
	"github.com/nanozuki/crows.moe/mediavote-api/store"
)

func RunServer() error {
	e := echo.New()
	api := e.Group("/mediavote/v1")
	api.Use(CORS(), terror.ErrorHandler)

	api.GET("/years", func(c echo.Context) error {
		years, err := service.GetYears(c.Request().Context())
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, map[string]any{"years": years})
	})
	api.GET("/years/current", func(c echo.Context) error {
		year, err := service.GetCurrentYear(c.Request().Context())
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, year)
	})
	api.GET("/awards/:year", func(c echo.Context) error {
		yearStr := c.Param("year")
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			return terror.InvalidValue("year")
		}
		awards, err := service.GetAwards(c.Request().Context(), year)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, map[string]any{"awards": awards})
	})
	api.GET("/ballots/:year", func(c echo.Context) error {
		yearStr := c.Param("year")
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			return terror.InvalidValue("year")
		}
		ballots, err := service.GetBallots(c.Request().Context(), year)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, map[string]any{"ballots": ballots})
	})

	// nomination stage
	api.GET("/nominations/:dept", func(c echo.Context) error {
		deptName := store.DepartmentName(c.Param("dept"))
		if !deptName.IsValid() {
			return terror.InvalidValue("department")
		}
		dept, err := service.GetNominations(c.Request().Context(), deptName)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, dept)
	}, RequireStage(store.StageNomination))
	api.POST("/nominations/:dept", func(c echo.Context) error {
		deptName := store.DepartmentName(c.Param("dept"))
		if !deptName.IsValid() {
			return terror.InvalidValue("department")
		}
		var req struct {
			WorkName string `json:"work_name"`
		}
		if err := c.Bind(&req); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		if req.WorkName == "" {
			return terror.RequiredFieldMissed("work_name")
		}
		dept, err := service.AddNomination(c.Request().Context(), deptName, req.WorkName)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, dept)
	}, RequireStage(store.StageNomination))

	// voting stage
	api.POST("/voters", func(c echo.Context) error {
		var req struct {
			Name string `json:"name"`
		}
		if err := c.Bind(&req); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		session, err := service.NewVoter(c.Request().Context(), req.Name)
		if err != nil {
			return err
		}
		c.SetCookie(newCookie(session))
		return c.JSON(http.StatusOK, map[string]any{})
	}, RequireStage(store.StageVoting))
	api.POST("/sessions", func(c echo.Context) error {
		var req struct {
			Name string `json:"name"`
			PIN  string `json:"pin"`
		}
		if err := c.Bind(&req); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		session, err := service.LoginVoter(c.Request().Context(), req.Name, req.PIN)
		if err != nil {
			return err
		}
		c.SetCookie(newCookie(session))
		return c.JSON(200, map[string]any{})
	}, RequireStage(store.StageVoting))
	api.PUT("/voters/ballot", func(c echo.Context) error {
		sessionCookie, err := c.Cookie(SessionCookieName)
		if err != nil || sessionCookie == nil || sessionCookie.Value == "" {
			return terror.NoAuth()
		}
		session, err := service.GetSession(c.Request().Context(), sessionCookie.Value)
		if err != nil {
			return err
		}
		var ballot store.Ballot
		if err := c.Bind(&ballot); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		ballot.Voter = session.Name
		if err := service.VoterEditBallot(c.Request().Context(), &ballot); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, &ballot)
	}, RequireStage(store.StageVoting))
	api.GET("/voters/ballot", func(c echo.Context) error {
		sessionCookie, err := c.Cookie(SessionCookieName)
		if err != nil || sessionCookie == nil || sessionCookie.Value == "" {
			return terror.NoAuth()
		}
		session, err := service.GetSession(c.Request().Context(), sessionCookie.Value)
		if err != nil {
			return err
		}
		var req struct {
			Dept store.DepartmentName `json:"dept"`
		}
		if err := c.Bind(&req); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		ballot, err := service.VoterGetBallot(c.Request().Context(), session.Name, req.Dept)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, ballot)
	}, RequireStage(store.StageVoting))

	return e.Start(":" + fmt.Sprint(env.Port()))
}

func CORS() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOriginFunc: func(origin string) (bool, error) {
			allow := strings.Contains(origin, "crows.moe") ||
				strings.Contains(origin, "localhost") || strings.Contains(origin, "127.0.0.1")
			return allow, nil
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
	SessionCookieName = "sessionid"
	CookieExpires     = 30 * 24 * time.Hour
)

func newCookie(session *store.Session) *http.Cookie {
	return &http.Cookie{
		Name:     SessionCookieName,
		Value:    session.Key,
		Path:     "/",
		Expires:  time.Now().Add(CookieExpires),
		Secure:   env.IsProd(),
		HttpOnly: true,
	}
}

func RequireStage(stage store.Stage) echo.MiddlewareFunc {
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
