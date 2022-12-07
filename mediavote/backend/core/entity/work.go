package entity

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
)

type Work struct {
	ID         uint       `json:"id"`
	Department Department `json:"department"`
	NameCn     string     `json:"nameCN"`
	NameOrigin string     `json:"nameOrigin"`
	Alias      []string   `json:"alias"`
}

func NewWork(input WorkInput) (*Work, error) {
	if err := input.Validate(); err != nil {
		return nil, err
	}
	return &Work{
		ID:         0,
		Department: input.Department,
		NameCn:     input.NameCn,
		NameOrigin: input.NameOrigin,
		Alias:      []string{},
	}, nil
}

func (w *Work) AddAlias(alias []string) {
	for _, a := range alias {
		var found bool
		for _, wa := range w.Alias {
			if wa == a {
				found = true
				break
			}
		}
		if !found {
			w.Alias = append(w.Alias, a)
		}
	}
}

func (i WorkInput) Validate() error {
	if !i.Department.IsValid() {
		return ierr.FormatError("department", i.Department)
	}
	if i.NameCn == "" {
		return ierr.RequiredFieldMissed("nameCN")
	}
	if i.NameOrigin == "" {
		return ierr.RequiredFieldMissed("nameOrigin")
	}
	return nil
}
