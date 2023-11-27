package main

import (
	"fmt"
	"time"
)

type EMAData map[int]YearData

type YearData struct {
	NominationStartAt Date                      `json:"nomination_start_at,omitempty"`
	VotingStartAt     Date                      `json:"voting_start_at,omitempty"`
	AwardStartAt      Date                      `json:"award_start_at,omitempty"`
	Works             map[Department][]*Work    `json:"works,omitempty"`
	Ballots           []*BallotData             `json:"ballots,omitempty"`
	Awards            map[Department]*AwardData `json:"awards,omitempty"`
}

func (yd *YearData) FindWork(dept Department, name string) *Work {
	for _, work := range yd.Works[dept] {
		if work.Name == name {
			return work
		}
	}
	return nil
}

type Date time.Time

func (d *Date) UnmarshalJSON(data []byte) error {
	t, err := time.Parse(`"2006-01-02"`, string(data))
	if err != nil {
		return err
	}
	*d = Date(t)
	return nil
}

func (d *Date) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf(`"%s"`, time.Time(*d).Format("2006-01-02"))), nil
}

func (d *Date) Time() time.Time {
	return time.Time(*d)
}

type Department string

const (
	DeptAnime         Department = "anime"
	DeptMangaAndNovel Department = "manga-novel"
	DeptGame          Department = "game"

	// legacy category
	DeptTVAnime    Department = "tv-anime"
	DeptNonTVAnime Department = "non-tv-anime"
	DeptManga      Department = "manga"
	DeptNovel      Department = "novel"
)

func (d *Department) UnmarshalJSON(data []byte) error {
	dept := Department(string(data))
	switch dept {
	case DeptAnime, DeptMangaAndNovel, DeptGame, DeptTVAnime, DeptNonTVAnime, DeptManga, DeptNovel:
		*d = dept
		return nil
	default:
		return fmt.Errorf("invalid department: %s", dept)
	}
}

func (d *Department) MarshalJSON() ([]byte, error) {
	return []byte(string(*d)), nil
}

type Work struct {
	Name       string   `json:"name,omitempty"`
	OriginName string   `json:"origin_name,omitempty"`
	Alias      []string `json:"alias,omitempty"`
}

type BallotData struct {
	Department Department        `json:"department,omitempty"`
	VoterName  string            `json:"voter_name,omitempty"`
	Rankings   []*RankedWorkName `json:"rankings,omitempty"`
}

type BallotDoc struct {
	Rankings []*RankedWorkName `json:"rankings,omitempty"`
}

type RankedWorkName struct {
	Ranking  int    `json:"ranking,omitempty"`
	WorkName string `json:"work_name,omitempty"`
}

type RankedWork struct {
	Ranking int   `json:"ranking,omitempty"`
	Work    *Work `json:"work,omitempty"`
}

type AwardData struct {
	Rankings []RankedWorkName `json:"rankings,omitempty"`
}

type YearDoc struct {
	Year              int          `json:"year,omitempty"`
	NominationStartAt time.Time    `json:"nomination_start_at,omitempty"`
	VotingStartAt     time.Time    `json:"voting_start_at,omitempty"`
	AwardStartAt      time.Time    `json:"award_start_at,omitempty"`
	Departments       []Department `json:"departments,omitempty"`
}

type AwardDoc struct {
	Rankings []*RankedWork `json:"rankings,omitempty"`
}

type VoterDoc struct {
	Name    string `json:"name,omitempty"`
	PinCode string `json:"pin_code,omitempty"`
}

func idYear(year int) string {
	return fmt.Sprint(year)
}

func idDept(dept Department) string {
	return string(dept)
}

func idBallot(ballot *BallotData) string {
	return fmt.Sprintf("%s#%s", ballot.VoterName, ballot.Department)
}
