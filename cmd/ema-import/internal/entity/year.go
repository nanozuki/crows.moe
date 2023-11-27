package entity

import (
	"context"
	"time"

	"github.com/nanozuki/crows.moe/mediavote-api/api"
	"github.com/nanozuki/crows.moe/mediavote-api/internal/val"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
)

type Year struct {
	Year              int                  `firestore:"year,omitempty" json:"year,omitempty"`
	NominationStartAt time.Time            `firestore:"nomination_start_at,omitempty" json:"nomination_start_at,omitempty"`
	VotingStartAt     time.Time            `firestore:"voting_start_at,omitempty" json:"voting_start_at,omitempty"`
	AwardStartAt      time.Time            `firestore:"award_start_at,omitempty" json:"award_start_at,omitempty"`
	Departments       []val.DepartmentName `firestore:"departments,omitempty" json:"departments,omitempty"`
}

func (y *Year) StageAt(t time.Time) val.Stage {
	switch {
	case t.After(y.AwardStartAt):
		return val.StageAward
	case t.After(y.VotingStartAt):
		return val.StageVoting
	case t.After(y.NominationStartAt):
		return val.StageNomination
	default:
		return val.StagePreparation
	}
}

func (y *Year) ToAPIView() *api.Year {
	view := &api.Year{
		Year:              y.Year,
		NominationStartAt: y.NominationStartAt.UnixMilli(),
		VotingStartAt:     y.VotingStartAt.UnixMilli(),
		AwardStartAt:      y.AwardStartAt.UnixMilli(),
	}
	for _, d := range y.Departments {
		view.Depts = append(view.Depts, d.String())
	}
	return view
}

func (y *Year) ValidateDept(dept val.DepartmentName) error {
	for _, d := range y.Departments {
		if d == dept {
			return nil
		}
	}
	return terror.InvalidValue("department")
}

type YearRepository interface {
	GetOne(ctx context.Context, year int) (*Year, error)
	GetAll(ctx context.Context) ([]*Year, error)
}

type YearUseCase struct {
	YearRepository
}

func (uc *YearUseCase) GetYearInStage(ctx context.Context, year int, stage val.Stage) (*Year, error) {
	y, err := uc.GetOne(ctx, year)
	if err != nil {
		return nil, err
	}
	if y.StageAt(time.Now()) != stage {
		return nil, terror.NotInStage(stage.String())
	}
	return y, nil
}
