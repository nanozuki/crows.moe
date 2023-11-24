package server

import (
	"context"
	"net/http"
	"reflect"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/mediavote-api/api"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
)

type Server struct {
	e         *echo.Echo
	mediaVote api.MediaVoteService
}

func NewServer(mediaVote api.MediaVoteService) *Server {
	s := &Server{
		e:         echo.New(),
		mediaVote: mediaVote,
	}
	s.e.Use(CORS(), middleware.Logger(), terror.ErrorHandler, middleware.Recover())
	v1 := s.e.Group("/mediavote/v1")
	v1.GET("/years", wrapHandler(s.mediaVote.GetYears))
	v1.GET("/years/:year", wrapHandler(s.mediaVote.GetYear))
	v1.GET("/years/:year/awards/:dept", wrapHandler(s.mediaVote.GetAwards))
	v1.GET("/years/:year/nominations/:dept", wrapHandler(s.mediaVote.GetNominations))
	v1.POST("/years/:year/nominations/:dept", wrapHandler(s.mediaVote.PostNominations))
	v1.GET("/years/:year/voters/logged", wrapHandler(s.mediaVote.GetLoggedVoter))
	v1.POST("/years/:year/voters", wrapHandler(s.mediaVote.SignUpVoter))
	v1.POST("/years/:year/sessions", wrapHandler(s.mediaVote.LogInVoter))
	v1.GET("/years/:year/ballots/:dept", wrapHandler(s.mediaVote.GetBallot))
	v1.PUT("/years/:year/ballots/:dept", wrapHandler(s.mediaVote.PutBallot))
	return s
}

func (s *Server) Run(addr string) error {
	return s.e.Start(addr)
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.e.Shutdown(ctx)
}

type HandlerFunc[Req, Res any] func(context.Context, *Req) (*Res, error)

func wrapHandler[Req, Res any](h HandlerFunc[Req, Res]) echo.HandlerFunc {
	var shouldBind bool
	{
		var req Req
		reqt := reflect.TypeOf(req)
		if reqt.Kind() != reflect.Struct {
			panic("request type must be a struct")
		}
		shouldBind = reqt.NumField() > 0
	}
	var setCookie bool
	{
		var res Res
		rest := reflect.TypeOf(res)
		if rest.Kind() != reflect.Struct {
			panic("response type must be a struct")
		}
		_, setCookie = any(&res).(CookieSetter)
	}
	return func(c echo.Context) error {
		var req Req
		if shouldBind {
			if err := c.Bind(&req); err != nil {
				return err
			}
		}
		res, err := h(c.Request().Context(), &req)
		if err != nil {
			return err
		}
		if setCookie {
			cookie := any(res).(CookieSetter).SetCookie()
			http.SetCookie(c.Response().Writer, cookie)
		}
		return c.JSON(200, res)
	}
}

type CookieSetter interface {
	SetCookie() *http.Cookie
}
