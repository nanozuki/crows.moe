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
	VoteID     uuid.UUID `gorm:"type:char(36);index"`
	Department Department
	Candidates Candidates `gorm:"type:json"`
}

func NewBallot(voteID uuid.UUID, d Department) *Ballot {
	return &Ballot{
		VoteID:     voteID,
		Department: d,
		Candidates: Candidates{},
	}
}

func (b *Ballot) NeedVerification() []*Verification {
	var vs []*Verification
	for _, c := range b.Candidates {
		if c.ID == 0 {
			vs = append(vs, &Verification{
				Name: c.Name,
				Verfify: func(work Work) {
					c.ID = work.ID
				},
			})
		}
	}
	return vs
}

type Department uint

const (
	_          Department = iota
	TVAnime               // 1
	NonTVAnime            // 2
	Manga                 // 3
	Game                  // 4
	Novel                 // 5
)

func AllDepartment() []Department {
	return []Department{TVAnime, NonTVAnime, Manga, Game, Novel}
}

func (d Department) String() string {
	switch d {
	case TVAnime:
		return "TVAnime"
	case NonTVAnime:
		return "NonTVAnime"
	case Manga:
		return "Manga"
	case Game:
		return "Game"
	case Novel:
		return "Novel"
	default:
		return "unknown"
	}
}

func (d Department) IsValid() bool {
	return d >= TVAnime && d <= Novel
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
	ID      uint   `json:"id"`
}

type Verification struct {
	Name    string
	Verfify func(work Work)
}
