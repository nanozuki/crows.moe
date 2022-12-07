package main

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/server"
)

func main() {
	srv := server.Server{}
	srv.Run()
}
