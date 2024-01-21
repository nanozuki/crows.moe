package fsdata

import (
	"fmt"
	"os"
	"time"

	"github.com/goccy/go-yaml"
	"github.com/nanozuki/crows.moe/cmd/ema-import/val"
)

type EMAData []*YearData

func NewEMADataFromFile(filename string) (EMAData, error) {
	f, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("open input: %w", err)
	}
	var data EMAData
	if err := yaml.NewDecoder(f).Decode(&data); err != nil {
		return nil, fmt.Errorf("unmarshal input: %w", err)
	}
	return data, nil
}

func (d EMAData) SaveToFile(filename string) error {
	f, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("create output: %w", err)
	}
	if err := yaml.NewEncoder(f).Encode(d); err != nil {
		return fmt.Errorf("marshal output: %w", err)
	}
	return nil
}

type YearData struct {
	Year              int                           `json:"year,omitempty"`
	NominationStartAt Date                          `json:"nomination_start_at,omitempty"`
	VotingStartAt     Date                          `json:"voting_start_at,omitempty"`
	AwardStartAt      Date                          `json:"award_start_at,omitempty"`
	Works             map[val.Department][]*Work    `json:"works,omitempty"`
	Ballots           []*BallotData                 `json:"ballots,omitempty"`
	Awards            map[val.Department]*AwardData `json:"awards,omitempty"`
}

func (yd *YearData) FindWork(dept val.Department, name string) *Work {
	for _, work := range yd.Works[dept] {
		if work.Name == name {
			return work
		}
	}
	return nil
}

type Date time.Time

func (d *Date) UnmarshalYAML(data []byte) error {
	t, err := time.Parse(`"2006-01-02"`, string(data))
	if err != nil {
		return err
	}
	*d = Date(t)
	return nil
}

func (d *Date) MarshalYAML() ([]byte, error) {
	return []byte(fmt.Sprintf(`"%s"`, time.Time(*d).Format("2006-01-02"))), nil
}

func (d *Date) Time() time.Time {
	return time.Time(*d)
}

type Work struct {
	Name       string   `json:"name,omitempty" firestore:"name,omitempty"`
	OriginName string   `json:"origin_name,omitempty" firestore:"origin_name,omitempty"`
	Alias      []string `json:"alias,omitempty" firestore:"alias,omitempty"`
}

type BallotData struct {
	Department val.Department    `json:"department,omitempty"`
	VoterName  string            `json:"voter_name,omitempty"`
	Rankings   []*RankedWorkName `json:"rankings,omitempty"`
}

type RankedWorkName struct {
	Ranking  int    `json:"ranking,omitempty" firestore:"ranking,omitempty"`
	WorkName string `json:"work_name,omitempty" firestore:"work_name,omitempty"`
}

type RankedWork struct {
	Ranking int   `json:"ranking,omitempty" firestore:"ranking,omitempty"`
	Work    *Work `json:"work,omitempty" firestore:"work,omitempty"`
}

type AwardData struct {
	Rankings []RankedWorkName `json:"rankings,omitempty"`
}

type YearDoc struct {
	Year              int              `json:"year,omitempty" firestore:"year,omitempty"`
	NominationStartAt time.Time        `json:"nomination_start_at,omitempty" firestore:"nomination_start_at,omitempty"`
	VotingStartAt     time.Time        `json:"voting_start_at,omitempty" firestore:"voting_start_at,omitempty"`
	AwardStartAt      time.Time        `json:"award_start_at,omitempty" firestore:"award_start_at,omitempty"`
	Departments       []val.Department `json:"departments,omitempty" firestore:"departments,omitempty"`
}

type BallotDoc struct {
	Rankings []*RankedWorkName `json:"rankings,omitempty" firestore:"rankings,omitempty"`
}

type AwardDoc struct {
	Rankings []*RankedWork `json:"rankings,omitempty" firestore:"rankings,omitempty"`
}

type VoterDoc struct {
	Name    string `json:"name,omitempty" firestore:"name,omitempty"`
	PinCode string `json:"pin_code,omitempty" firestore:"pin_code,omitempty"`
}

type DepartmentDoc struct {
	Works []*Work `firestore:"works,omitempty"`
}

func IdYear(year int) string {
	return fmt.Sprint(year)
}

func IdDept(dept val.Department) string {
	return string(dept)
}

func IdBallot(ballot *BallotData) string {
	return fmt.Sprintf("%s#%s", ballot.VoterName, ballot.Department)
}
