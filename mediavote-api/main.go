package main

import (
	"github.com/nanozuki/crows.moe/mediavote-api/tools/inj"
	"github.com/rs/zerolog/log"
)

//go:generate go run -mod=mod github.com/99designs/gqlgen generate
//go:generate go run -mod=mod github.com/google/wire/cmd/wire ./tools/inj

func main() {
	server, err := inj.InitServer()
	if err != nil {
		log.Fatal().Msg(err.Error())
	}
	if err := server.Run(); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
