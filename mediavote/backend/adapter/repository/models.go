package repository

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Ballot struct {
	gorm.Model
	VoteID     uuid.UUID `gorm:"type:char(36);index"`
	Department entity.Department
	Candidates Candidates `gorm:"type:json"`
}
type Candidate struct {
	Ranking uint `json:"ranking"`
	WorkID  uint `json:"id"`
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

type Nomination struct {
	gorm.Model
	VoterID    uint
	Department entity.Department
	WorkName   string
	WorkID     uint
}

type Voter struct {
	gorm.Model
	PinCode string
	Name    string
}

type Work struct {
	gorm.Model
	Department entity.Department
	NameCN     string `gorm:"type:varchar(255)"`
	NameOrigin string `gorm:"type:varchar(255)"`
}
