package store

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	uuid "github.com/satori/go.uuid"
)

/* collections:
mediavote_years: store yearly time infos
	-> departments: {dept -> works[]}
	-> voters:      {name -> {name, pinCode}}
	-> sessions:    {key -> user}
	-> ballots:     {dept,voteName -> rankings}
	-> awards:      {dept -> rankings}
*/

const (
	ColYear       = "mediavote_years"
	ColDepartment = "departments"
	ColVoter      = "voters"
	ColSession    = "sessions"
	ColBallot     = "ballots"
	ColAwards     = "awards"
)

type Year struct {
	Year              int       `firestore:"year,omitempty" json:"year,omitempty"`
	NominationStartAt time.Time `firestore:"nomination_start_at,omitempty" json:"nomination_start_at,omitempty"`
	VotingStartAt     time.Time `firestore:"voting_start_at,omitempty" json:"voting_start_at,omitempty"`
	AwardStartAt      time.Time `firestore:"award_start_at,omitempty" json:"award_start_at,omitempty"`
}

func (y *Year) ID() string {
	return fmt.Sprint(y.Year)
}

func (y *Year) Stage() Stage {
	now := time.Now()
	switch {
	case now.After(y.AwardStartAt):
		return StageAward
	case now.After(y.VotingStartAt):
		return StageVoting
	case now.After(y.NominationStartAt):
		return StageNomination
	default:
		return StagePreparation
	}
}

type Department struct {
	Dept  DepartmentName `firestore:"dept,omitempty" json:"dept,omitempty"`
	Works []*Work        `firestore:"works,omitempty" json:"works,omitempty"`
}

func (d *Department) ID() string {
	return d.Dept.String()
}

func (d *Department) HasWork(name string) bool {
	for _, w := range d.Works {
		if w.Name == name {
			return true
		}
	}
	return false
}

func (d *Department) AddWork(name string) {
	for _, work := range d.Works {
		if work.Name == name || work.OriginName == name {
			return
		}
		for _, alias := range work.Alias {
			if alias == name {
				return
			}
		}
	}
	d.Works = append(d.Works, &Work{Name: name})
}

type Voter struct {
	Name    string `firestore:"name,omitempty"`
	PinCode string `firestore:"pin_code,omitempty"`
}

func NewVoter(name string) (*Voter, error) {
	if name == "" {
		return nil, terror.RequiredFieldMissed("name")
	}
	code := rand.Int31n(90_000) + 10_000 // 10_000 - 99_999
	return &Voter{
		Name:    name,
		PinCode: fmt.Sprint(code),
	}, nil
}

func (v *Voter) ID() string {
	return fmt.Sprintf("%s#%s", v.Name, v.PinCode)
}

type Session struct {
	Key  string `firestore:"key,omitempty"`
	Name string `firestore:"name,omitempty"`
}

func NewSession(name string) *Session {
	return &Session{Name: name, Key: uuid.NewV4().String()}
}

func (s *Session) ID() string {
	return s.Key
}

type Ballot struct {
	Voter    string         `firestore:"voter,omitempty"`
	Dept     DepartmentName `firestore:"dept,omitempty"`
	Rankings []RankingItem  `firestore:"rankings,omitempty"`
}

func (b *Ballot) ID() string {
	return fmt.Sprintf("%s#%s", b.Voter, b.Dept.String())
}

func (b *Ballot) Validator(dept *Department) error {
	for _, r := range b.Rankings {
		if r.Ranking <= 1 {
			return terror.InvalidValue("ranking")
		}
		if !dept.HasWork(r.WorkName) {
			return terror.InvalidValue("work_name")
		}
	}
	return nil
}

type Awards struct {
	Dept     DepartmentName `firestore:"dept,omitempty" json:"dept,omitempty"`
	Rankings []RankingItem  `firestore:"rankings,omitempty" json:"rankings,omitempty"`
}

func (a *Awards) ID() string {
	return a.Dept.String()
}

type Work struct {
	Name       string   `firestore:"name,omitempty" json:"name,omitempty"`
	OriginName string   `firestore:"origin_name,omitempty" json:"origin_name,omitempty"`
	Alias      []string `firestore:"alias,omitempty" json:"alias,omitempty"`
}

type RankingItem struct {
	Ranking  int    `firestore:"ranking,omitempty"`
	WorkName string `firestore:"work_name,omitempty"`
}

type Stage string

const (
	StagePreparation Stage = "Preparation"
	StageNomination  Stage = "Nomination"
	StageVoting      Stage = "Voting"
	StageAward       Stage = "Award"
)

var AllStage = []Stage{
	StagePreparation,
	StageNomination,
	StageVoting,
	StageAward,
}

func (e Stage) IsValid() bool {
	switch e {
	case StagePreparation, StageNomination, StageVoting, StageAward:
		return true
	}
	return false
}

func (e Stage) String() string {
	return string(e)
}

type DepartmentName string

const (
	Anime         DepartmentName = "anime"
	MangaAndNovel DepartmentName = "manga-novel"
	Game          DepartmentName = "game"
)

var AllDepartment = []DepartmentName{
	Anime,
	MangaAndNovel,
	Game,
}

func (e DepartmentName) IsValid() bool {
	switch e {
	case Anime, MangaAndNovel, Game:
		return true
	}
	return false
}

func (e DepartmentName) String() string {
	return string(e)
}
