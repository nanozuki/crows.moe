package repository

import (
	"encoding/json"

	"github.com/lib/pq"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/generic"
	"gorm.io/gorm"
)

type Ballot struct {
	gorm.Model
	VoterID    uint              `gorm:"index:idx_ballot_voter_dp,unique,priority:1"`
	Department entity.Department `gorm:"index:idx_ballot_voter_dp,unique,priority:2"`
	Candidates []byte            `gorm:"type:jsonb"`
}

func NewBallotFromEntity(ballot *entity.Ballot) *Ballot {
	return &Ballot{
		Model: gorm.Model{
			ID: ballot.ID,
		},
		VoterID:    ballot.VoterID,
		Department: ballot.Department,
		Candidates: generic.Must(json.Marshal(ballot.Candidates)),
	}
}

func (b Ballot) ToEntity() *entity.Ballot {
	ballot := &entity.Ballot{
		ID:         b.ID,
		VoterID:    b.VoterID,
		Department: b.Department,
	}
	if err := json.Unmarshal(b.Candidates, &ballot.Candidates); err != nil {
		panic(err)
	}
	return ballot
}

type Nomination struct {
	gorm.Model
	VoterID    uint
	Department entity.Department
	WorkName   string
	WorkID     uint
}

type Voter struct {
	gorm.Model
	PinCode string
	Name    string
}

type Work struct {
	gorm.Model
	Department entity.Department
	NameCN     string `gorm:"type:varchar(255)"`
	NameOrigin string `gorm:"type:varchar(255)"`
	Alias      pq.StringArray
}
