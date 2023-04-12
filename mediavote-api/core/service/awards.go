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

func GetAwards(ctx context.Context, year int) ([]*entity.Award, error) {
	return store.GetAwardsByYear(ctx, year)
}

func GetBallots(ctx context.Context, year int) ([]*entity.Ballot, error) {
	return store.GetBallotsByYear(ctx, year)
}

func ComputeAwards(ctx context.Context, year int) ([]*entity.Award, error) {
	ballots, err := store.GetBallotsByYear(ctx, year)
	if err != nil {
		return nil, err
	}
	ballotsByDept := map[entity.DepartmentName][]*entity.Ballot{}
	for _, ballot := range ballots {
		ballotsByDept[ballot.Dept] = append(ballotsByDept[ballot.Dept], ballot)
	}
	awards := []*entity.Award{}
	for dept, bs := range ballotsByDept {
		award, err := computeDeptAward(ctx, dept, bs)
		if err != nil {
			return nil, err
		}
		awards = append(awards, award)
	}
	err = store.SetAwards(ctx, year, awards)
	return awards, err
}

func computeDeptAward(ctx context.Context, deptName entity.DepartmentName, ballots []*entity.Ballot) (*entity.Award, error) {
	dept, err := store.GetOrNewDepartment(ctx, deptName)
	if err != nil {
		return nil, err
	}
	items, err := schulze.Compute(ctx, ballots)
	if err != nil {
		return nil, err
	}
	awards := entity.NewAwards(dept, items)
	return awards, nil
}
