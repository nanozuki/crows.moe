package port

import (
	"context"
	"database/sql"
	"time"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	uuid "github.com/satori/go.uuid"
)

type EntityRepository[ID, Entity, EntityQuery, EntityUpdate any] interface {
	GetByID(ctx context.Context, id ID) (*Entity, error)
	Search(ctx context.Context, query *EntityQuery) ([]*Entity, error)
	Create(ctx context.Context, nomi *Entity) error
	UpdateOne(ctx context.Context, id uint, update *EntityUpdate) error
	UpdateMany(ctx context.Context, query *EntityQuery, update *EntityUpdate) error
	Delete(ctx context.Context, id uint) error
}

type Repository interface {
	WithTx(ctx context.Context, fn func(context.Context) error, opts ...*sql.TxOptions) error

	Ballot() EntityRepository[uint, entity.Ballot, BallotQuery, BallotUpdate]
	Nomination() EntityRepository[uint, entity.Nomination, NominationQuery, NominationUpdate]
	Ranking() EntityRepository[uint, entity.Ranking, RankingQuery, RankingUpdate]
	Session() EntityRepository[uuid.UUID, entity.Session, SessionQuery, SessionUpdate]
	Voter() EntityRepository[uint, entity.Voter, VoterQuery, VoterUpdate]
	Work() EntityRepository[uint, entity.Work, WorkQuery, WorkUpdate]
}

type BallotQuery struct {
	VoterID    uint
	Department entity.Department
}

type BallotUpdate struct {
	Candidates []*entity.WorkRanking
}

type NominationQuery struct {
	Department entity.Department
	VoterID    uint
	WorkNames  []string
}

type NominationUpdate struct {
	WorkName string
	WorkID   uint
}

type RankingQuery struct {
	Department entity.Department
}

type RankingUpdate struct{}

type SessionQuery struct{}

type SessionUpdate struct {
	ExpireAt time.Time
}

type VoterQuery struct {
	Name string
	Pin  string
}

type VoterUpdate struct{}

type WorkQuery struct {
	Department entity.Department
}

type WorkUpdate struct {
	NameCN     string
	NameOrigin string
	Alias      []string
}
