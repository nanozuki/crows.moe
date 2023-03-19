package server

import (
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service/auth"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service/gql"
	"github.com/nanozuki/crows.moe/mediavote-api/graph"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
)

type Server struct {
	Resolver    *gql.Resolver
	AuthService *auth.Service
}

func (s *Server) Run() error {
	gqlSrv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers:  s.Resolver,
		Directives: s.Resolver.DirectiveRoot(),
	}))
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
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
	}))
	e.Use(s.loadCtxUser)
	api := e.Group("/api")
	api.Any("/", echo.WrapHandler(playground.Handler("Mediavote GraphQL playground", "/query")))
	api.Any("/query", echo.WrapHandler(gqlSrv))
	api.POST("/register", s.Register)
	api.POST("/login", s.Login)

	return e.Start(":" + env.Port())
}
