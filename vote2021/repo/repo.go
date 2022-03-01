package repo

import (
	"context"

	"github.com/nanozuki/crows.moe/vote2021/entity"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func (r *Repository) CreateVote(ctx context.Context, vote *entity.Vote) error {
	return r.DB.WithContext(ctx).Create(vote).Error
}

func (r *Repository) FindBallot(ctx context.Context, voteID uuid.UUID, partment entity.Partment) (*entity.Ballot, error) {
	var b entity.Ballot
	r.DB.WithContext(ctx).
		Where("vote_id = ? AND partment = ?", voteID, partment).
		Take(&b)
	panic("not implemented") // TODO: Implement
}

func (r *Repository) SaveBallot(ctx context.Context, ballot *entity.Ballot) error {
	panic("not implemented") // TODO: Implement
}
