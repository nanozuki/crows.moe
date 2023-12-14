package pgdata

import (
	"time"

	"github.com/nanozuki/crows.moe/cmd/ema-import/val"
)

type Date time.Time

const DateFormat = "2006-01-02"

func (d *Date) MarshalCSV() (string, error) {
	return time.Time(*d).Format(DateFormat), nil
}

func (d *Date) UnmarshalCSV(csv string) error {
	t, err := time.Parse(DateFormat, csv)
	if err != nil {
		return err
	}
	*d = Date(t)
	return nil
}

type Ceremony struct {
	Year              int              `json:"year,omitempty"`
	Departments       []val.Department `json:"departments,omitempty"`
	NominationStartAt Date             `json:"nomination_start_at,omitempty"`
	VotingStartAt     Date             `json:"voting_start_at,omitempty"`
	AwardStartAt      Date             `json:"award_start_at,omitempty"`
}

type Work struct {
	Id         int            `json:"id,omitempty"`
	Year       int            `json:"year,omitempty"`
	Department val.Department `json:"department,omitempty"`
	Ranking    int            `json:"ranking,omitempty"`
}

type WorkNameType string

const (
	MainName   WorkNameType = "main"
	OriginName WorkNameType = "origin"
	AliasName  WorkNameType = "alias"
)

type WorkName struct {
	Id     int          `json:"id,omitempty"`
	WorkId int          `json:"work_id,omitempty"`
	Name   string       `json:"name,omitempty"`
	Type   WorkNameType `json:"type,omitempty"`
}

type Voter struct {
	Id           int    `json:"id,omitempty"`
	Name         string `json:"name,omitempty"`
	Salt         string `json:"salt,omitempty"`
	PasswordHash string `json:"password_hash,omitempty"`
}

type Vote struct {
	Id         int            `json:"id,omitempty"`
	VoterId    int            `json:"voter_id,omitempty"`
	Year       int            `json:"year,omitempty"`
	Department val.Department `json:"department,omitempty"`
}

type RankingInVote struct {
	Id      int `json:"id,omitempty"`
	VoteId  int `json:"vote_id,omitempty"`
	WorkId  int `json:"work_id,omitempty"`
	Ranking int `json:"ranking,omitempty"`
}
