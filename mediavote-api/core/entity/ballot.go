package entity

import "github.com/nanozuki/crows.moe/mediavote-api/pkg/ierr"

type Ballot struct {
	ID         uint           `json:"id"`
	VoterID    uint           `json:"voterID"`
	Department Department     `json:"department"`
	Candidates []*WorkRanking `json:"candidates"`
}

type WorkRanking struct {
	Ranking int  `json:"Ranking"`
	WorkID  uint `json:"WorkID"`
}

func NewBallot(voterID uint, input BallotInput) (*Ballot, error) {
	if !input.Department.IsValid() {
		return nil, ierr.FormatError("department", input.Department)
	}
	ballot := Ballot{
		VoterID:    voterID,
		Department: input.Department,
	}
	ballot.SetCandidates(input.Candidates)
	return &ballot, nil
}

func (b *Ballot) SetCandidates(candidates []*WorkRankingInput) {
	for _, c := range candidates {
		b.Candidates = append(b.Candidates, &WorkRanking{
			Ranking: c.Ranking,
			WorkID:  c.WorkID,
		})
	}
}
