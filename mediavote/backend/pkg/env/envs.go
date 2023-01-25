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

func getOnce(name string, g func() any) any {
	envs.lock.Lock()
	defer envs.lock.Unlock()
	v, ok := envs.store[name]
	if ok {
		return v.(string)
	}
	v = g()
	envs.store[name] = v
	return v
}

func get(name string) string {
	return getOnce(name, func() any {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			panic(ierr.RequiredEnvMissed(envPrefix + name))
		}
		return e
	}).(string)
}

func getMapOr[T any](name string, fallback T, f func(string) (T, error)) T {
	return getOnce(name, func() any {
		e := os.Getenv(envPrefix + name)
		if e == "" {
			return fallback
		}
		t, err := f(e)
		if err != nil {
			panic(ierr.FormatError("name", e).From(err))
		}
		return t
	}).(T)
}
