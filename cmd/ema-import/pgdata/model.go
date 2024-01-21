package pgdata

import (
	"errors"
	"strings"
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

type Array[T ~string] []T

func (a *Array[T]) MarshalCSV() (string, error) {
	builder := strings.Builder{}
	builder.WriteRune('{')
	for i, v := range *a {
		if i != 0 {
			builder.WriteRune(',')
		}
		builder.WriteString(string(v))
	}
	builder.WriteRune('}')
	return builder.String(), nil
}

func (a *Array[T]) UnmarshalCSV(csv string) error {
	if csv[0] != '{' || csv[len(csv)-1] != '}' {
		return errors.New("invalid array format")
	}
	values := strings.Split(csv[1:len(csv)-1], ",")
	var result []T
	for _, v := range values {
		result = append(result, T(v))
	}
	*a = result
	return nil
}

type Ceremony struct {
	Year              int                   `json:"year,omitempty" csv:"year"`
	Departments       Array[val.Department] `json:"departments,omitempty" csv:"departments"`
	NominationStartAt Date                  `json:"nomination_start_at,omitempty" csv:"nomination_start_at"`
	VotingStartAt     Date                  `json:"voting_start_at,omitempty" csv:"voting_start_at"`
	AwardStartAt      Date                  `json:"award_start_at,omitempty" csv:"award_start_at"`
}

type Work struct {
	Id         int            `json:"id,omitempty" csv:"id"`
	Year       int            `json:"year,omitempty" csv:"year"`
	Department val.Department `json:"department,omitempty" csv:"department"`
	Name       string         `json:"name,omitempty" csv:"name"`
	OriginName string         `json:"origin_name,omitempty" csv:"origin_name"`
	Aliases    Array[string]  `json:"aliases,omitempty" csv:"aliases"`
	Ranking    int            `json:"ranking,omitempty" csv:"ranking"`
}

type Voter struct {
	Id           int    `json:"id,omitempty" csv:"id"`
	Name         string `json:"name,omitempty" csv:"name"`
	Salt         string `json:"salt,omitempty" csv:"salt"`
	PasswordHash string `json:"password_hash,omitempty" csv:"password_hash"`
}

type Vote struct {
	Id         int            `json:"id,omitempty" csv:"id"`
	VoterId    int            `json:"voter_id,omitempty" csv:"voter_id"`
	Year       int            `json:"year,omitempty" csv:"year"`
	Department val.Department `json:"department,omitempty" csv:"department"`
}

type RankingInVote struct {
	Id      int `json:"id,omitempty" csv:"id"`
	VoteId  int `json:"vote_id,omitempty" csv:"vote_id"`
	WorkId  int `json:"work_id,omitempty" csv:"work_id"`
	Ranking int `json:"ranking,omitempty" csv:"ranking"`
}
