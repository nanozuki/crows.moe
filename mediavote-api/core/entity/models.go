package entity

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	uuid "github.com/satori/go.uuid"
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
	Name    string `firestore:"name,omitempty" json:"name,omitempty"`
	PinCode string `firestore:"pin_code,omitempty" json:"pin_code,omitempty"`
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
	return v.Name
}

type Session struct {
	Key  string `firestore:"key,omitempty" json:"key,omitempty"`
	Name string `firestore:"name,omitempty" json:"name,omitempty"`
}

func NewSession(name string) *Session {
	return &Session{Name: name, Key: uuid.NewV4().String()}
}

func (s *Session) ID() string {
	return s.Key
}

type Ballot struct {
	Voter    string         `firestore:"voter,omitempty" json:"voter,omitempty"`
	Dept     DepartmentName `firestore:"dept,omitempty" json:"dept,omitempty"`
	Rankings []RankingItem  `firestore:"rankings,omitempty" json:"rankings,omitempty"`
}

func (b *Ballot) ID() string {
	return fmt.Sprintf("%s#%s", b.Voter, b.Dept.String())
}

func (b *Ballot) Validator(dept *Department) error {
	for _, r := range b.Rankings {
		if r.Ranking < 1 {
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
