package main

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service"
	"github.com/nanozuki/crows.moe/mediavote-api/core/store"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/server"
	"github.com/rs/zerolog/log"
)

func main() {
	if env.Environment() == env.EnvDev {
		store.LoadDevData()
		stage := entity.Stage(env.DevStage())
		if stage == entity.StageAward {
			if _, err := service.ComputeAwards(context.Background(), 2022); err != nil {
				log.Fatal().Msg(err.Error())
			}
		}
	}
	if err := server.RunServer(); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
