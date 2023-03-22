package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/store"
)

func GetYears(ctx context.Context) ([]*store.Year, error) {
	return store.GetYears(ctx)
}

func GetCurrentYear(ctx context.Context) (*store.Year, error) {
	return store.GetCurrentYear(ctx)
}

func GetAwards(ctx context.Context, year int) ([]*store.Awards, error) {
	return store.GetAwardsByYear(ctx, year)
}

func GetBallots(ctx context.Context, year int) ([]*store.Ballot, error) {
	return store.GetBallotsByYear(ctx, year)
}
