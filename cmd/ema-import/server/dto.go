package server

import "github.com/nanozuki/crows.moe/cmd/ema-import/core/entity"

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

type Ballot struct {
	Rankings []entity.RankingItem `json:"rankings,omitempty"`
}

func NewBallotFromEntity(ballot *entity.Ballot) *Ballot {
	return &Ballot{
		Rankings: ballot.Rankings,
	}
}

func (b *Ballot) ToEntity(voter string, dept entity.DepartmentName) *entity.Ballot {
	return &entity.Ballot{
		Voter:    voter,
		Dept:     dept,
		Rankings: b.Rankings,
	}
}
