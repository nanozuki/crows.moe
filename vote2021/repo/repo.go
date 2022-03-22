package repo

import (
	"context"

	"github.com/nanozuki/crows.moe/vote2021/entity"
	"github.com/nanozuki/crows.moe/vote2021/service"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func (r *Repository) CreateVote(ctx context.Context, vote *entity.Vote) error {
	return r.DB.WithContext(ctx).Create(vote).Error
}

func (r *Repository) FindBallot(ctx context.Context, voteID uuid.UUID, d entity.Department) (*entity.Ballot, error) {
	var b entity.Ballot
	err := r.DB.WithContext(ctx).
		Where("vote_id = ? AND department = ?", voteID, d).
		Take(&b).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, service.ErrEntityNotFound
		}
		return nil, err
	}
	return &b, nil
}

func (r *Repository) SaveBallot(ctx context.Context, ballot *entity.Ballot) error {
	return r.DB.WithContext(ctx).Save(ballot).Error
}
