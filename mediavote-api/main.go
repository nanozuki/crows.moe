package main

import (
	"github.com/rs/zerolog/log"
)

func main() {
	if err := RunServer(); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
