package env

import (
	"os"

	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

var (
	Port        = mustGet("PORT")
	AdminKey    = get("ADMIN_KEY")
	Environment = get("ENV")
	IsProd      = get("ENV") == EnvProd
)

const (
	EnvProd = "production"
)

const envPrefix = "MEDIAVOTE_"

func get(name string) string {
	return os.Getenv(envPrefix + name)
}

func mustGet(name string) string {
	e := get(name)
	if e == "" {
		panic(ierr.RequiredEnvMissed(name))
	}
	return e
}
