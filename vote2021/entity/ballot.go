package entity

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Ballot struct {
	ID         uint `gorm:"primaryKey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	VoteID     uuid.UUID `gorm:"type:char(36)"`
	Department Department
	Candidates Candidates `gorm:"type:blob"`
}

func NewBallot(voteID uuid.UUID, d Department) *Ballot {
	return &Ballot{
		VoteID:     voteID,
		Department: d,
	}
}

type Department uint8

const (
	TVAnime Department = iota
	NonTVAnime
	Manga
	Game
	Novel
)

func (d Department) IsValid() bool {
	return d <= Novel
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
