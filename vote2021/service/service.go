package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/nanozuki/crows.moe/vote2021/entity"
	uuid "github.com/satori/go.uuid"
)

type Service struct {
	Repo Repo
}

type Repo interface {
	CreateVote(ctx context.Context, vote *entity.Vote) error
	FindBallot(ctx context.Context, id uuid.UUID, d entity.Department) (*entity.Ballot, error)
	SaveBallot(ctx context.Context, ballot *entity.Ballot) error
}

var ErrEntityNotFound = errors.New("entity not found")

func (s *Service) NewVote(ctx context.Context, userName string) (*entity.Vote, error) {
	vote := entity.NewVote(userName)
	err := s.Repo.CreateVote(ctx, &vote)
	return &vote, err
}

func (s *Service) GetBallot(ctx context.Context, voteID uuid.UUID, d entity.Department) (*entity.Ballot, error) {
	if !d.IsValid() {
		return nil, fmt.Errorf("invalid partment: %v", d)
	}
	ballot, err := s.Repo.FindBallot(ctx, voteID, d)
	if err != nil {
		if err != ErrEntityNotFound {
			return nil, err
		}
		ballot = entity.NewBallot(voteID, d)
	}
	return ballot, nil
}

func (s *Service) UpdateBallot(
	ctx context.Context, voteID uuid.UUID, d entity.Department, candidates entity.Candidates,
) (*entity.Ballot, error) {
	if !d.IsValid() {
		return nil, fmt.Errorf("invalid d: %v", d)
	}
	ballot, err := s.Repo.FindBallot(ctx, voteID, d)
	if err != nil {
		if err != ErrEntityNotFound {
			return nil, err
		}
		ballot = entity.NewBallot(voteID, d)
	}
	ballot.Candidates = candidates
	return ballot, s.Repo.SaveBallot(ctx, ballot)
}
