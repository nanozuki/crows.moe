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
	PgDSN       = mustGet("PG_DSN")
	RedisAddr   = mustGet("REDIS_ADDR")
	RedisDB     = getOr("REDIS_DB", "0")
)

const (
	EnvProd = "production"
)

const envPrefix = "MEDIAVOTE_"

func get(name string) string {
	return os.Getenv(envPrefix + name)
}

func getOr(name string, fallback string) string {
	e := get(name)
	if e == "" {
		return fallback
	}
	return e
}

func mustGet(name string) string {
	e := get(name)
	if e == "" {
		panic(ierr.RequiredEnvMissed(name))
	}
	return e
}
