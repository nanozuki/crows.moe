package main

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/generic"
	"github.com/nanozuki/crows.moe/mediavote/backend/tools/inj"
)

//go:generate go run -mod=mod github.com/99designs/gqlgen generate
//go:generate go run -mod=mod github.com/google/wire/cmd/wire ./server

func main() {
	server := generic.Must(inj.InitServer())
	server.Run()
}
