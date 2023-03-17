package env

import (
	"os"
	"strconv"
	"sync"

	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

func Port() string        { return get("PORT") }
func AdminKey() string    { return get("ADMIN_KEY") }
func Environment() string { return get("ENV") }
func IsProd() bool        { return get("ENV") == EnvProd }
func PgDSN() string       { return get("PG_DSN") }
func RedisAddr() string   { return get("REDIS_ADDR") }
func RedisDB() int        { return getMapOr("REDIS_DB", 0, strconv.Atoi) }

const (
	EnvProd = "production"
)

const envPrefix = "MEDIAVOTE_"

var envs = struct {
	lock  sync.Mutex
	store map[string]any
}{store: map[string]any{}}

func getOnce[T any](name string, g func() T) T {
	envs.lock.Lock()
	defer envs.lock.Unlock()
	exist, ok := envs.store[name]
	if ok {
		return exist.(T)
	}
	value := g()
	envs.store[name] = value
	return value
}

func get(name string) string {
	return getOnce(name, func() string {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			panic(ierr.RequiredEnvMissed(envPrefix + name))
		}
		return e
	})
}

func getMapOr[T any](name string, fallback T, f func(string) (T, error)) T {
	return getOnce(name, func() T {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			return fallback
		}
		t, err := f(e)
		if err != nil {
			panic(ierr.FormatError("name", e).From(err))
		}
		return t
	})
}
