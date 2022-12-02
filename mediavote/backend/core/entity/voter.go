package entity

import (
	"fmt"
	"math/rand"

	"gorm.io/gorm"
)

type Voter struct {
	gorm.Model
	PinCode string
	Name    string
}

func NewVoter(name string) Voter {
	voter := Voter{Name: name}
	code := rand.Int31n(10000)
	voter.PinCode = fmt.Sprintf("%04d", code)
	return voter
}
