package server

import "github.com/nanozuki/crows.moe/mediavote-api/core/entity"

type Year struct {
	Year              int   `json:"year,omitempty"`
	NominationStartAt int64 `json:"nomination_start_at,omitempty"`
	VotingStartAt     int64 `json:"voting_start_at,omitempty"`
	AwardStartAt      int64 `json:"award_start_at,omitempty"`
}

func NewYearFromEntity(year *entity.Year) *Year {
	return &Year{
		Year:              year.Year,
		NominationStartAt: year.NominationStartAt.UnixMilli(),
		VotingStartAt:     year.VotingStartAt.UnixMilli(),
		AwardStartAt:      year.AwardStartAt.UnixMilli(),
	}
}

type GetYearsResponse struct {
	Years []*Year `json:"years,omitempty"`
}
