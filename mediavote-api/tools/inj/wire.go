//go:build wireinject
// +build wireinject

package inj

import (
	"github.com/google/wire"
	"github.com/nanozuki/crows.moe/mediavote-api/adapter/repository"
	"github.com/nanozuki/crows.moe/mediavote-api/core/port"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service/auth"
	"github.com/nanozuki/crows.moe/mediavote-api/core/service/gql"
	"github.com/nanozuki/crows.moe/mediavote-api/server"
)

func InitServer() (*server.Server, error) {
	wire.Build(
		wire.Struct(new(server.Server), "*"),
		wire.Struct(new(auth.Service), "*"),
		gql.NewResolver,
		repository.NewRepository,
		wire.Bind(new(port.Repository), new(*repository.Repository)),
	)
	return &server.Server{}, nil
}

func InitAuthService() (*auth.Service, error) {
	wire.Build(
		wire.Struct(new(auth.Service), "*"),
		repository.NewRepository,
		wire.Bind(new(port.Repository), new(*repository.Repository)),
	)
	return &auth.Service{}, nil
}

func InitGqlResolver() (*gql.Resolver, error) {
	wire.Build(
		wire.Struct(new(gql.Resolver), "*"),
		repository.NewRepository,
		wire.Bind(new(port.Repository), new(*repository.Repository)),
	)
	return &gql.Resolver{}, nil
}
