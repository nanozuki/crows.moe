package main

import (
	"github.com/nanozuki/crows.moe/mediavote-api/core/store"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/server"
	"github.com/rs/zerolog/log"
)

func main() {
	if env.Environment() == env.EnvDev {
		store.LoadDevData()
	}
	if err := server.RunServer(); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
