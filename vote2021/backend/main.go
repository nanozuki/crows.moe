package main

import (
	"log"
	"os"

	"github.com/nanozuki/crows.moe/vote2021/backend/httpapi"
	"github.com/nanozuki/crows.moe/vote2021/backend/repo"
	"github.com/nanozuki/crows.moe/vote2021/backend/service"
)

func must[T any](result T, err error) T {
	if err != nil {
		log.Fatal(err)
	}
	return result
}

func main() {
	dsn := os.Getenv("VOTE2021_PG")
	repo := must(repo.NewRepository(dsn))
	srv := httpapi.NewServer(&service.Service{Repo: repo})
	log.Fatal(srv.Echo.Start("[::]:8000"))
}
