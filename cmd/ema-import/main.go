package main

import (
	"context"

	"github.com/nanozuki/crows.moe/cmd/ema-import/core/entity"
	"github.com/nanozuki/crows.moe/cmd/ema-import/core/service"
	"github.com/nanozuki/crows.moe/cmd/ema-import/core/store"
	"github.com/nanozuki/crows.moe/cmd/ema-import/pkg/env"
	"github.com/nanozuki/crows.moe/cmd/ema-import/server"
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
