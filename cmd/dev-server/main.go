package main

import (
	"log"
	"net/http"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var hosts = map[string]*echo.Echo{}

func frontend() {
	upstream, err := url.Parse("http://localhost:3000")
	if err != nil {
		log.Fatal(err)
	}
	targets := []*middleware.ProxyTarget{{URL: upstream}}
	e := echo.New()
	e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))
	hosts["app.crows.local:8000"] = e
}

func backend() {
	upstream, err := url.Parse("http://localhost:8080")
	if err != nil {
		log.Fatal(err)
	}
	targets := []*middleware.ProxyTarget{{URL: upstream}}
	e := echo.New()
	e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))
	hosts["api.crows.local:8000"] = e
}

func main() {
	frontend()
	backend()
	e := echo.New()
	e.Any("/*", func(c echo.Context) error {
		req := c.Request()
		res := c.Response()
		host, ok := hosts[req.Host]
		if ok {
			host.ServeHTTP(res, req)
			return nil
		} else {
			return echo.NewHTTPError(http.StatusNotFound, "Host Not Found")
		}
	})
	if err := e.StartTLS(":8000", "./_wildcard.crows.local.pem", "./_wildcard.crows.local-key.pem"); err != nil {
		e.Logger.Fatal(err)
	}
}
