package port

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/val"
)

type EntityRepository[ID, Entity, EntityQuery, EntityUpdate any] interface {
	GetByID(ctx context.Context, id ID) (*Entity, error)
	Search(ctx context.Context, query *EntityQuery) ([]*Entity, error)
	Create(ctx context.Context, nomi *Entity) error
	Update(ctx context.Context, id uint, update *EntityUpdate) error
	Delete(ctx context.Context, id uint) error
}

type Repository interface {
	Nomination() EntityRepository[uint, entity.Nomination, NominationQuery, NominationUpdate]
	Work() EntityRepository[uint, entity.Work, WorkQuery, WorkUpdate]
}

type NominationQuery struct {
	Department val.Department
	VoterID    uint
}

type NominationUpdate struct {
	WorkName string
	WorkID   uint
}

type WorkQuery struct {
	Department val.Department
}

type WorkUpdate struct {
	NameCN     string
	NameOrigin string
}
