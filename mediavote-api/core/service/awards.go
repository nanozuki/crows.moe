package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/store"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/schulze"
)

func GetYears(ctx context.Context) ([]*entity.Year, error) {
	return store.GetYears(ctx)
}

func GetCurrentYear(ctx context.Context) (*entity.Year, error) {
	return store.GetCurrentYear(ctx)
}

func GetAwards(ctx context.Context, year int) ([]*entity.Awards, error) {
	return store.GetAwardsByYear(ctx, year)
}

func GetBallots(ctx context.Context, year int) ([]*entity.Ballot, error) {
	return store.GetBallotsByYear(ctx, year)
}

func ComputeAwards(ctx context.Context, year int) ([]*entity.Awards, error) {
	ballots, err := store.GetBallotsByYear(ctx, year)
	if err != nil {
		return nil, err
	}
	ballotsByDept := map[entity.DepartmentName][]*entity.Ballot{}
	for _, ballot := range ballots {
		ballotsByDept[ballot.Dept] = append(ballotsByDept[ballot.Dept], ballot)
	}
	awards := []*entity.Awards{}
	for _, bs := range ballotsByDept {
		a, err := schulze.Compute(ctx, bs)
		if err != nil {
			return nil, err
		}
		awards = append(awards, a)
	}
	err = store.SetAwards(ctx, year, awards)
	return awards, err
}
