package entity

import "github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"

type Nomination struct {
	ID         uint       `json:"id"`
	VoterID    uint       `json:"voterID"`
	Department Department `json:"department"`
	WorkName   string     `json:"workName"`
	WorkID     *uint      `json:"workID"`
}

func NewNomination(voterID uint, dep Department, workName string) (*Nomination, error) {
	if !dep.IsValid() {
		return nil, ierr.FormatError("department", dep)
	}
	if workName == "" {
		return nil, ierr.RequiredFieldMissed("workName")
	}
	return &Nomination{
		VoterID:    voterID,
		Department: dep,
		WorkName:   workName,
	}, nil
}
