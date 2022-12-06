package entity

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type Ballot struct {
	ID         uint           `json:"id"`
	VoterID    uint           `json:"voterID"`
	Department Department     `json:"department"`
	Candidates []*WorkRanking `json:"candidates"`
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
