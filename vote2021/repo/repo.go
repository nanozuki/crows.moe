package repo

import (
	"context"
	"strings"

	"github.com/nanozuki/crows.moe/vote2021/entity"
	"github.com/nanozuki/crows.moe/vote2021/service"
	"github.com/pkg/errors"
	uuid "github.com/satori/go.uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func NewRepository(dsn string) (*Repository, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&entity.Vote{}, &entity.Ballot{}); err != nil {
		return nil, err
	}
	return &Repository{db}, nil
}

func (r *Repository) CreateVote(ctx context.Context, vote *entity.Vote) error {
	err := r.DB.WithContext(ctx).Create(vote).Error
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			return service.ErrEntityDuplicated
		}
	}
	return nil
}

func (r *Repository) FindVote(ctx context.Context, id uuid.UUID) (*entity.Vote, error) {
	var v entity.Vote
	if err := r.DB.WithContext(ctx).Where("id = ?", id).Take(&v).Error; err != nil {
		return nil, errors.Wrap(err, "find vote")
	}
	return &v, nil
}

func (r *Repository) FindBallot(ctx context.Context, voteID uuid.UUID, d entity.Department) (*entity.Ballot, error) {
	if _, err := r.FindVote(ctx, voteID); err != nil {
		return nil, err
	}
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
