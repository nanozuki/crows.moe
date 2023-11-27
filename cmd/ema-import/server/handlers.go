package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/cmd/ema-import/core/entity"
	"github.com/nanozuki/crows.moe/cmd/ema-import/core/service"
	"github.com/nanozuki/crows.moe/cmd/ema-import/pkg/env"
	"github.com/nanozuki/crows.moe/cmd/ema-import/pkg/terror"
	"github.com/rs/zerolog/log"
)

func RunServer() error {
	e := echo.New()
	api := e.Group("/mediavote/v1")
	api.Use(CORS(), middleware.Logger(), terror.ErrorHandler, middleware.Recover())

	api.GET("/years", func(c echo.Context) error {
		years, err := service.GetYears(c.Request().Context())
		if err != nil {
			return err
		}
		res := &GetYearsResponse{}
		for _, year := range years {
			res.Years = append(res.Years, NewYearFromEntity(year))
		}
		return c.JSON(http.StatusOK, res)
	})
	api.GET("/years/current", func(c echo.Context) error {
		year, err := service.GetCurrentYear(c.Request().Context())
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, NewYearFromEntity(year))
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
	api.POST("/awards/:year", func(c echo.Context) error {
		yearStr := c.Param("year")
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			return terror.InvalidValue("year")
		}
		awards, err := service.ComputeAwards(c.Request().Context(), year)
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
		deptName := entity.DepartmentName(c.Param("dept"))
		if !deptName.IsValid() {
			return terror.InvalidValue("department")
		}
		dept, err := service.GetNominations(c.Request().Context(), deptName)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, dept)
	})
	api.POST("/nominations/:dept", func(c echo.Context) error {
		deptName := entity.DepartmentName(c.Param("dept"))
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
	}, RequireStage(entity.StageNomination))

	// voting stage
	api.GET("/voters", func(c echo.Context) error {
		var res struct {
			Name string `json:"name,omitempty"`
		}
		sessionCookie, err := c.Cookie(SessionCookieName)
		if err != nil || sessionCookie == nil || sessionCookie.Value == "" {
			return c.JSON(200, &res)
		}
		session, err := service.GetSession(c.Request().Context(), sessionCookie.Value)
		if terror.IsErrCode(err, "InvalidToken") {
			return c.JSON(200, &res)
		}
		if err != nil {
			return err
		}
		res.Name = session.Name
		return c.JSON(200, &res)
	}, RequireStage(entity.StageVoting))
	api.POST("/voters", func(c echo.Context) error {
		var req struct {
			Name string `json:"name"`
		}
		if err := c.Bind(&req); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		voter, session, err := service.NewVoter(c.Request().Context(), req.Name)
		if err != nil {
			return err
		}
		log.Info().Msgf("Set-Cookie: %+v", newCookie(session))
		c.SetCookie(newCookie(session))
		return c.JSON(http.StatusOK, voter)
	}, RequireStage(entity.StageVoting))
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
		log.Info().Msgf("Set-Cookie: %+v", newCookie(session))
		c.SetCookie(newCookie(session))
		return c.JSON(200, map[string]any{})
	}, RequireStage(entity.StageVoting))
	api.PUT("/voters/ballots/:dept", func(c echo.Context) error {
		sessionCookie, err := c.Cookie(SessionCookieName)
		if err != nil || sessionCookie == nil || sessionCookie.Value == "" {
			return terror.NoAuth()
		}
		session, err := service.GetSession(c.Request().Context(), sessionCookie.Value)
		if err != nil {
			return err
		}
		var ballot Ballot
		if err := c.Bind(&ballot); err != nil {
			return terror.InvalidRequestBody().Wrap(err)
		}
		entity := ballot.ToEntity(session.Name, entity.DepartmentName(c.Param("dept")))
		if err := service.VoterEditBallot(c.Request().Context(), entity); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, &ballot)
	}, RequireStage(entity.StageVoting))
	api.GET("/voters/ballots/:dept", func(c echo.Context) error {
		sessionCookie, err := c.Cookie(SessionCookieName)
		if err != nil || sessionCookie == nil || sessionCookie.Value == "" {
			return terror.NoAuth()
		}
		session, err := service.GetSession(c.Request().Context(), sessionCookie.Value)
		if err != nil {
			return err
		}
		deptName := entity.DepartmentName(c.Param("dept"))
		if deptName == "" {
			return terror.RequiredFieldMissed("dept")
		}
		if !deptName.IsValid() {
			return terror.InvalidValue("dept")
		}
		entity, err := service.VoterGetBallot(c.Request().Context(), session.Name, deptName)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, NewBallotFromEntity(entity))
	}, RequireStage(entity.StageVoting))

	return e.Start(":" + fmt.Sprint(env.Port()))
}
