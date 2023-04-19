package service

import (
	"context"

	"github.com/nanozuki/crows.moe/vote2021/backend/entity"
)

func (s *Service) FindBallots(ctx context.Context, dp entity.Department) ([]*entity.Ballot, error) {
	ballots, err := s.Repo.FindBallots(ctx, dp)
	if err != nil {
		return nil, err
	}
	return ballots, nil
}

func (s *Service) FindWorks(ctx context.Context, dp entity.Department) ([]*entity.Work, error) {
	return s.FindWorks(ctx, dp)
}

func (s *Service) EnsureWork(ctx context.Context, dp entity.Department, name string) (*entity.Work, error) {
	return s.EnsureWork(ctx, dp, name)
}
