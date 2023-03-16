package server

import (
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	e.Any("/", echo.WrapHandler(playground.Handler("Mediavote GraphQL playground", "/query")))
	e.Any("/query", echo.WrapHandler(gqlSrv))
	e.POST("/register", s.Register)
	e.POST("/login", s.Login)

	e.Logger.Fatal(e.Start(":" + env.Port()))
}

/*
Accept-Encoding: gzip, deflate, br
Referer: http://localhost:3000/
Content-Length: 312
Origin: http://localhost:3000
Connection: keep-alive
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
DNT: 1
Sec-GPC: 1
*/
