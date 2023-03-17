package entity

import "github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"

type Nomination struct {
	ID         uint       `json:"id"`
	Department Department `json:"department"`
	WorkName   string     `json:"workName"`
	WorkID     *uint      `json:"workID"`
}

func NewNomination(dep Department, workName string) (*Nomination, error) {
	if !dep.IsValid() {
		return nil, ierr.FormatError("department", dep)
	}
	if workName == "" {
		return nil, ierr.RequiredFieldMissed("workName")
	}
	return &Nomination{
		Department: dep,
		WorkName:   workName,
	}, nil
}
