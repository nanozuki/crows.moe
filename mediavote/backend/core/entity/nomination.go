package entity

import "github.com/nanozuki/crows.moe/mediavote/backend/pkg/errors"

type Nomination struct {
	ID         uint       `json:"id"`
	VoterID    uint       `json:"voterID"`
	Department Department `json:"department"`
	WorkName   string     `json:"workName"`
	WorkID     *uint      `json:"workID"`
}

func NewNomination(voterID uint, dep Department, workName string) (*Nomination, error) {
	if !dep.IsValid() {
		return nil, errors.FormatError("department", dep)
	}
	if workName == "" {
		return nil, errors.RequiredMissedError("workName")
	}
	return &Nomination{
		VoterID:    voterID,
		Department: dep,
		WorkName:   workName,
	}, nil
}
