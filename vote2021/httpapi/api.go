package httpapi

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/labstack/echo/v4"
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
	{
		api.POST("/vote", srv.NewVote)
		api.GET("/vote/:vote_id/:partment", nil)
		api.PUT("/vote/:vote_id/:partment", nil)
	}
	feSrv, err := url.Parse(fmt.Sprintf("http://127.0.0.1:3000"))
	if err != nil {
		log.Fatal(err)
	}
	srv.Echo.Any("/*", echo.WrapHandler(httputil.NewSingleHostReverseProxy(feSrv)))
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
	VoteID   string `param:"vote_id"`
	Partment uint8  `param:"partment"`
}

type GetBallotRes struct {
	Candidates entity.Candidates `json:"candidates"`
}

func (s *Server) GetBallot(c echo.Context) error {
	req := &GetBallotReq{}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid request: %v", err))
	}
	ctx := c.Request().Context()
	voteID, err := uuid.FromString(req.VoteID)
	if err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid vote_id: %v", req.VoteID))
	}
	res, err := s.Service.GetBallot(ctx, voteID, entity.Department(req.Partment))
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, GetBallotRes{Candidates: res.Candidates})
}

type PutBallotReq struct {
	VoteID     string            `param:"vote_id"`
	Partment   string            `param:"partment"`
	Candidates entity.Candidates `json:"candidates"`
}

type PutBallotRes struct {
	Candidates entity.Candidates `json:"candidates"`
}

func (s *Server) PutBallot(c echo.Context) error {
	req := &PutBallotReq{}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid request: %v", err))
	}
	ctx := c.Request().Context()
	voteID, err := uuid.FromString(req.VoteID)
	if err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("invalid vote_id: %v", req.VoteID))
	}
	res, err := s.Service.UpdateBallot(ctx, voteID, req.Partment, req.Candidates)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, GetBallotRes{Candidates: res.Candidates})
}
