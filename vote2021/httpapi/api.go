package httpapi

import (
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/vote2021/entity"
	"github.com/nanozuki/crows.moe/vote2021/service"
	uuid "github.com/satori/go.uuid"
)

type Server struct {
	Echo    *echo.Echo
	Service *service.Service
}

func NewServer(svc *service.Service) *Server {
	srv := &Server{
		Echo:    echo.New(),
		Service: svc,
	}
	api := srv.Echo.Group("/api")
	api.Use(middleware.Logger())
	{
		api.POST("/vote", srv.NewVote)
		api.GET("/vote/:vote_id/:department", srv.GetBallot)
		api.PUT("/vote/:vote_id/:department", srv.PutBallot)
	}
	{ // reverse proxy frontend
		feSrv, err := url.Parse("http://127.0.0.1:3000")
		if err != nil {
			log.Fatal(err)
		}
		targets := []*middleware.ProxyTarget{{URL: feSrv}}
		srv.Echo.Any("/*", nil, middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))
	}
	return srv
}

type NewVoteReq struct {
	UserName string `json:"user_name"`
}

type NewVoteRes struct {
	ID       string `json:"id"`
	UserName string `json:"user_name"`
}

func (s *Server) NewVote(c echo.Context) error {
	req := NewVoteReq{}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid request: %v", err))
	}
	res, err := s.Service.NewVote(c.Request().Context(), req.UserName)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, NewVoteRes{res.ID.String(), res.UserName})
}

type GetBallotReq struct {
	VoteID     string `param:"vote_id"`
	Department uint8  `param:"department"`
}

type GetBallotRes struct {
	Candidates entity.Candidates `json:"candidates"`
}

func (s *Server) GetBallot(c echo.Context) error {
	req := GetBallotReq{}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid request: %v", err))
	}
	fmt.Println("vote_id:", c.Param("vote_id"))
	ctx := c.Request().Context()
	voteID, err := uuid.FromString(req.VoteID)
	if err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid vote_id: '%v'", req.VoteID))
	}
	res, err := s.Service.GetBallot(ctx, voteID, entity.Department(req.Department))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, GetBallotRes{Candidates: res.Candidates})
}

type PutBallotReq struct {
	VoteID     string            `param:"vote_id"`
	Department entity.Department `param:"department"`
	Candidates entity.Candidates `json:"candidates"`
}

type PutBallotRes struct {
	Candidates entity.Candidates `json:"candidates"`
}

func (s *Server) PutBallot(c echo.Context) error {
	req := PutBallotReq{}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid request: %v", err))
	}
	ctx := c.Request().Context()
	voteID, err := uuid.FromString(req.VoteID)
	if err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid vote_id: %v", req.VoteID))
	}
	res, err := s.Service.UpdateBallot(ctx, voteID, req.Department, req.Candidates)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, GetBallotRes{Candidates: res.Candidates})
}
