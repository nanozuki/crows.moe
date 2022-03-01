package entity

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Ballot struct {
	ID         uint `gorm:"primarykey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	VoteID     uuid.UUID `gorm:"type:char(36)"`
	Partment   Partment
	Candidates Candidates `gorm:"type:bolb"`
}

func NewBallot(voteID uuid.UUID, partment Partment) *Ballot {
	return &Ballot{
		VoteID:   voteID,
		Partment: partment,
	}
}

type Partment uint8

const (
	TVAnime Partment = iota
	NonTVAnime
	Manga
	Game
	Novel
)

func (p Partment) IsValid() bool {
	return p <= Novel
}

type Candidates []Candidate

func (c *Candidates) Scan(value interface{}) error {
	var bs []byte
	switch v := value.(type) {
	case string:
		bs = []byte(v)
	case []byte:
		bs = v
	default:
		return fmt.Errorf("invalid candidates: '%v'", value)
	}
	return json.Unmarshal(bs, c)
}

func (c Candidates) Value() (driver.Value, error) {
	return json.Marshal(c)
}

type Candidate struct {
	Name    string `json:"name"`
	Ranking uint   `json:"ranking"`
	ID      int    `json:"id"`
}
