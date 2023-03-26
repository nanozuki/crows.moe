package main

import (
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/store"
	"github.com/rs/zerolog/log"
)

func main() {
	if env.Environment() == env.EnvDev {
		store.LoadDevData()
	}
	if err := RunServer(); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
