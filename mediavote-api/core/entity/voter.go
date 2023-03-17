package entity

import (
	"fmt"
	"math/rand"

	"github.com/nanozuki/crows.moe/mediavote-api/pkg/ierr"
)

type Voter struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	PinCode string `json:"-"`
}

func NewVoter(name string) (*Voter, error) {
	if name == "" {
		return nil, ierr.RequiredFieldMissed("name")
	}
	voter := Voter{Name: name}
	code := rand.Int31n(10000)
	voter.PinCode = fmt.Sprintf("%04d", code)
	return &voter, nil
}
