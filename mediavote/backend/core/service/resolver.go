package service

import "github.com/nanozuki/crows.moe/mediavote/backend/core/port"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Repository port.Repository
}
