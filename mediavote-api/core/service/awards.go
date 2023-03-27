package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/store"
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
