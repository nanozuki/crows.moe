package entity

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/core/val"
	"gorm.io/gorm"
)

type Nomination struct {
	gorm.Model
	VoterID    uint
	Department val.Department
	WorkName   string
	WorkID     uint
}

func NewNomination(input *NominationInput) (*Nomination, error) {
	if err := input.Validate(); err != nil {
		return nil, err
	}
	return &Nomination{
		VoterID:    input.VoterID,
		Department: input.Department,
		WorkName:   input.WorkName,
	}, nil
}

func (n *Nomination) Edit(workName string) bool {
	if n.WorkName == workName {
		return false
	}
	n.WorkName = workName
	n.WorkID = 0
	return true
}

type NominationInput struct {
	VoterID    uint           `json:"voter_id"`
	Department val.Department `json:"department"`
	WorkName   string         `json:"work_name"`
}

func (n NominationInput) Validate() error {
	return nil
}
