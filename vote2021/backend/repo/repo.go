package repo

import (
	"context"
	"os"
	"strings"

	"github.com/nanozuki/crows.moe/vote2021/backend/entity"
	"github.com/nanozuki/crows.moe/vote2021/backend/service"
	"github.com/pkg/errors"
	uuid "github.com/satori/go.uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func NewRepository() (*Repository, error) {
	dsn := os.Getenv("VOTE2021_PG")
	if dsn == "" {
		return nil, errors.New("postgres uri is required")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	// if err := db.AutoMigrate(&entity.Vote{}, &entity.Ballot{}); err != nil {
	// 	return nil, err
	// }
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

func (r *Repository) FindBallots(ctx context.Context, dp entity.Department) ([]*entity.Ballot, error) {
	var bs []*entity.Ballot
	err := r.DB.WithContext(ctx).
		Where("department = ?", dp).
		Find(&bs).Error
	if err != nil {
		return nil, err
	}
	return bs, nil
}

func (r *Repository) SaveBallot(ctx context.Context, ballot *entity.Ballot) error {
	return r.DB.WithContext(ctx).Save(ballot).Error
}

func (r *Repository) FindWorks(ctx context.Context, dp entity.Department) ([]*entity.Work, error) {
	var works []*entity.Work
	err := r.DB.WithContext(ctx).Where("department = ?", dp).Find(&works).Error
	if err != nil {
		return nil, err
	}
	return works, nil
}

func (r *Repository) EnsureWork(ctx context.Context, dp entity.Department, name string) (*entity.Work, error) {
	var work entity.Work
	err := r.DB.WithContext(ctx).
		Where("department = ? AND name = ?", dp, name).
		Take(&work).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			work = entity.Work{
				ID:         0,
				Department: dp,
				Name:       name,
			}
			if err := r.DB.WithContext(ctx).Save(&work).Error; err != nil {
				return nil, err
			}
			return &work, nil
		}
		return nil, err
	}
	return &work, nil
}
