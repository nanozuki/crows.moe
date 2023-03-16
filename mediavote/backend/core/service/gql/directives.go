package gql

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/graph"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

var DirectiveRoot = graph.DirectiveRoot{
	HasAuth: func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
		if entity.CtxUserFromContext(ctx).VoterID == 0 {
			return nil, ierr.NoAuth()
		}
		return next(ctx)
	},
}
