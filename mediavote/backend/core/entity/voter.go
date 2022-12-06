package entity

import (
	"fmt"
	"math/rand"
)

type Voter struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	PinCode string `json:"-"`
}

func NewVoter(name string) Voter {
	voter := Voter{Name: name}
	code := rand.Int31n(10000)
	voter.PinCode = fmt.Sprintf("%04d", code)
	return voter
}
