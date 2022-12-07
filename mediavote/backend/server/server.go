package server

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/service/auth"
	"github.com/nanozuki/crows.moe/mediavote/backend/graph"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/env"
)

type Server struct {
	GqlResolvers  graph.ResolverRoot
	GqlDirectives graph.DirectiveRoot
	AuthService   *auth.Service
}

func (s *Server) Run() {
	gqlSrv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers:  s.GqlResolvers,
		Directives: s.GqlDirectives,
	}))
	e := echo.New()
	e.Use(s.loadCtxUser)

	e.Any("/", echo.WrapHandler(playground.Handler("Mediavote GraphQL playground", "/query")))
	e.Any("/query", echo.WrapHandler(gqlSrv))
	e.POST("/register", s.Register)
	e.POST("/login", s.Login)

	e.Logger.Fatal(e.Start(":" + env.Port))
}
