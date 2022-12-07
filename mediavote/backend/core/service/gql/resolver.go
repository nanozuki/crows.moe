package gql

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Repository port.Repository
}

func unwrapPtr[T any](pt *T) T {
	if pt == nil {
		var t T
		return t
	}
	return *pt
}

func toPtr[T any](t T) *T {
	return &t
}
