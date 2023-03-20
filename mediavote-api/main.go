package main

import (
	"github.com/rs/zerolog/log"
)

func main() {
	if err := RunServer(8080); err != nil {
		log.Fatal().Msg(err.Error())
	}
}
