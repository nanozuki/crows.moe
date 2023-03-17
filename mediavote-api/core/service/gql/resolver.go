package gql

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/port"
	"github.com/nanozuki/crows.moe/mediavote-api/graph"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/ierr"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Repository port.Repository
}

func NewResolver(repo port.Repository) (*Resolver, error) {
	r := &Resolver{Repository: repo}
	if env.Environment() == env.EnvDev {
		if err := r.initDevExampleData(); err != nil {
			return nil, err
		}
	}
	return r, nil
}

func (r *Resolver) initDevExampleData() error {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()
	if err := r.Repository.AnnualInfo().Create(ctx, &entity.AnnualInfo{
		Year:               2022,
		Stage:              entity.StageNominations,
		NominationsStartAt: time.Now().Add(-24 * time.Hour),
		VoteStartAt:        time.Now().Add(24 * time.Hour),
		AwardsStartAt:      time.Now().Add(48 * time.Hour),
	}); err != nil {
		return err
	}
	works := []*entity.Work{
		{
			ID:         1,
			Department: entity.DepartmentTVAnime,
			NameCN:     "孤独摇滚！",
			NameOrigin: "ぼっち・ざ・ろっく！",
		},
		{
			ID:         2,
			Department: entity.DepartmentGame,
			NameCN:     "战神：诸神黄昏",
			NameOrigin: "God of War: Ragnarök",
		},
	}
	noms := []*entity.Nomination{
		{
			Department: entity.DepartmentTVAnime,
			WorkName:   "孤独摇滚！",
			WorkID:     &works[0].ID,
		},
		{
			Department: entity.DepartmentTVAnime,
			WorkName:   "明日同学的水手服",
			WorkID:     &works[1].ID,
		},
		{
			Department: entity.DepartmentGame,
			WorkName:   "战神5",
			WorkID:     &works[1].ID,
		},
	}
	for _, work := range works {
		if err := r.Repository.Work().Create(ctx, work); err != nil {
			return err
		}
	}
	for _, nom := range noms {
		if err := r.Repository.Nomination().Create(ctx, nom); err != nil {
			return err
		}
	}
	return nil
}

func (r *Resolver) hasAuth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	if entity.CtxUserFromContext(ctx).VoterID == 0 {
		return nil, ierr.NoAuth()
	}
	return next(ctx)
}

func (r *Resolver) inNominationsStage(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	info, err := r.Query().ThisYear(ctx)
	if err != nil {
		return nil, err
	}
	if info.Stage != entity.StageNominations {
		return nil, ierr.AtWrongStage(entity.StageNominations.String())
	}
	return next(ctx)
}

func (r *Resolver) inVoteStage(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	info, err := r.Query().ThisYear(ctx)
	if err != nil {
		return nil, err
	}
	if info.Stage != entity.StageVote {
		return nil, ierr.AtWrongStage(entity.StageVote.String())
	}
	return next(ctx)
}

func (r *Resolver) DirectiveRoot() graph.DirectiveRoot {
	return graph.DirectiveRoot{
		HasAuth:            r.hasAuth,
		InNominationsStage: r.inNominationsStage,
		InVoteStage:        r.inVoteStage,
	}

}
