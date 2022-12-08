// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package entity

import (
	"fmt"
	"io"
	"strconv"
)

type BallotInput struct {
	Department Department          `json:"department"`
	Candidates []*WorkRankingInput `json:"candidates"`
}

type Ranking struct {
	Department Department     `json:"department"`
	Rankings   []*WorkRanking `json:"rankings"`
}

type WorkInput struct {
	Department Department `json:"department"`
	NameCn     string     `json:"nameCN"`
	NameOrigin string     `json:"nameOrigin"`
}

type WorkRankingInput struct {
	Ranking int  `json:"Ranking"`
	WorkID  uint `json:"WorkID"`
}

type Department string

const (
	DepartmentTVAnime    Department = "TVAnime"
	DepartmentNonTVAnime Department = "NonTVAnime"
	DepartmentManga      Department = "Manga"
	DepartmentGame       Department = "Game"
	DepartmentNovel      Department = "Novel"
)

var AllDepartment = []Department{
	DepartmentTVAnime,
	DepartmentNonTVAnime,
	DepartmentManga,
	DepartmentGame,
	DepartmentNovel,
}

func (e Department) IsValid() bool {
	switch e {
	case DepartmentTVAnime, DepartmentNonTVAnime, DepartmentManga, DepartmentGame, DepartmentNovel:
		return true
	}
	return false
}

func (e Department) String() string {
	return string(e)
}

func (e *Department) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Department(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Department", str)
	}
	return nil
}

func (e Department) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
