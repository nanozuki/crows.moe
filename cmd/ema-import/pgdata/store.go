package pgdata

import (
	"context"
	"encoding/json"
	"os"
	"strings"

	"github.com/nanozuki/crows.moe/cmd/ema-import/fsdata"
	"github.com/nanozuki/crows.moe/cmd/ema-import/val"
)

type Table struct {
	Ceremony      []*Ceremony
	Work          []*Work
	WorkName      []*WorkName
	Voter         []*Voter
	Vote          []*Vote
	RankingInVote []*RankingInVote
}

type Index struct {
	CeremonyPk      map[int]*Ceremony
	WorkPk          map[int]*Work
	WorkNamePk      map[int]*WorkName
	WorkNameWorkIdx map[int]map[string]*Work // year -> name -> work
	VoterPk         map[int]*Voter
	VoterNameIdx    map[string]*Voter
	VotePk          map[int]*Vote
	RankingPk       map[int]*RankingInVote
}

type Store struct {
	table Table
	index Index
}

func (s *Store) AddYearDoc(yd *fsdata.YearDoc) {
	c := Ceremony{
		Year:              yd.Year,
		Departments:       yd.Departments,
		NominationStartAt: Date(yd.NominationStartAt),
		VotingStartAt:     Date(yd.VotingStartAt),
		AwardStartAt:      Date(yd.AwardStartAt),
	}
	s.table.Ceremony = append(s.table.Ceremony, &c)
	s.index.CeremonyPk[c.Year] = &c
}

func (s *Store) AddDepartmentDoc(year int, department val.Department, dd *fsdata.DepartmentDoc) {
	for _, work := range dd.Works {
		w := Work{
			Id:         len(s.table.Work) + 1,
			Year:       year,
			Department: department,
		}
		s.table.Work = append(s.table.Work, &w)
		s.index.WorkPk[w.Id] = &w
		s.addWorkName(&w, work)
	}
}

func (s *Store) addWorkName(work *Work, workDoc *fsdata.Work) {
	names := []*WorkName{{
		Id:     len(s.table.WorkName) + 1,
		WorkId: work.Id,
		Name:   workDoc.Name,
		Type:   MainName,
	}}
	if workDoc.OriginName != "" {
		names = append(names, &WorkName{
			Id:     len(s.table.WorkName) + 1,
			WorkId: work.Id,
			Name:   workDoc.OriginName,
			Type:   OriginName,
		})
	}
	for _, alias := range workDoc.Alias {
		names = append(names, &WorkName{
			Id:     len(s.table.WorkName) + 1,
			WorkId: work.Id,
			Name:   alias,
			Type:   AliasName,
		})
	}
	for _, name := range names {
		s.table.WorkName = append(s.table.WorkName, name)
		s.index.WorkNamePk[name.Id] = name
		if _, ok := s.index.WorkNameWorkIdx[work.Year]; !ok {
			s.index.WorkNameWorkIdx[work.Year] = map[string]*Work{}
		}
		s.index.WorkNameWorkIdx[work.Year][name.Name] = s.index.WorkPk[work.Id]
	}
}

func (s *Store) FindAndCreateVoter(name string) *Voter {
	if name == "nanozuki" {
		name = "Nanozuki"
	}
	if voter, ok := s.index.VoterNameIdx[name]; ok {
		return voter
	}
	v := Voter{
		Id:   len(s.table.Voter) + 1,
		Name: name,
	}
	s.table.Voter = append(s.table.Voter, &v)
	s.index.VoterPk[v.Id] = &v
	s.index.VoterNameIdx[v.Name] = &v
	return &v
}

func (s *Store) AddBallotDoc(year int, voterName string, department val.Department, doc *fsdata.BallotDoc) {
	voter := s.FindAndCreateVoter(voterName)

	vote := Vote{
		Id:         len(s.table.Vote) + 1,
		VoterId:    voter.Id,
		Year:       year,
		Department: department,
	}
	s.table.Vote = append(s.table.Vote, &vote)
	s.index.VotePk[vote.Id] = &vote

	for _, ranking := range doc.Rankings {
		work := s.index.WorkNameWorkIdx[year][ranking.WorkName]
		r := RankingInVote{
			Id:      len(s.table.RankingInVote) + 1,
			VoteId:  vote.Id,
			WorkId:  work.Id,
			Ranking: ranking.Ranking,
		}
		s.table.RankingInVote = append(s.table.RankingInVote, &r)
		s.index.RankingPk[r.Id] = &r
	}
}

func (s *Store) AddAwardDoc(year int, department val.Department, doc *fsdata.AwardDoc) {
	for _, ranking := range doc.Rankings {
		work := s.index.WorkNameWorkIdx[year][ranking.Work.Name]
		work.Ranking = ranking.Ranking
	}
}

func (s *Store) WriteToFile(dir string) error {
	writeTable := func(name string, table interface{}) error {
		f, err := os.OpenFile(dir+"/"+name+".json", os.O_CREATE|os.O_WRONLY, 0o644)
		if err != nil {
			return err
		}
		if err := json.NewEncoder(f).Encode(table); err != nil {
			return err
		}
		return nil
	}
	if err := writeTable("ceremony", s.table.Ceremony); err != nil {
		return err
	}
	if err := writeTable("work", s.table.Work); err != nil {
		return err
	}
	if err := writeTable("work_name", s.table.WorkName); err != nil {
		return err
	}
	if err := writeTable("voter", s.table.Voter); err != nil {
		return err
	}
	if err := writeTable("vote", s.table.Vote); err != nil {
		return err
	}
	if err := writeTable("ranking_in_vote", s.table.RankingInVote); err != nil {
		return err
	}
	return nil
}

func NewStoreFromFirestore(ctx context.Context) (*Store, error) {
	fss := fsdata.NewStore(true)
	store := &Store{
		index: Index{
			CeremonyPk:      map[int]*Ceremony{},
			WorkPk:          map[int]*Work{},
			WorkNamePk:      map[int]*WorkName{},
			WorkNameWorkIdx: map[int]map[string]*Work{},
			VoterPk:         map[int]*Voter{},
			VoterNameIdx:    map[string]*Voter{},
			VotePk:          map[int]*Vote{},
			RankingPk:       map[int]*RankingInVote{},
		},
	}
	years, err := fsdata.GetAll[fsdata.YearDoc](fss, ctx, fsdata.ColYear)
	if err != nil {
		return nil, err
	}
	for _, year := range years {
		store.AddYearDoc(year)

		voters, err := fsdata.GetAll[fsdata.VoterDoc](fss, ctx,
			fsdata.ColYear, fsdata.IdYear(year.Year), fsdata.ColVoter)
		if err != nil {
			return nil, err
		}
		for _, voter := range voters {
			store.FindAndCreateVoter(voter.Name)
		}

		departments, err := fsdata.GetAll[fsdata.DepartmentDoc](fss, ctx,
			fsdata.ColYear, fsdata.IdYear(year.Year), fsdata.ColDepartment)
		if err != nil {
			return nil, err
		}
		for id, ddoc := range departments {
			store.AddDepartmentDoc(year.Year, val.Department(id), ddoc)
		}

		ballots, err := fsdata.GetAll[fsdata.BallotDoc](fss, ctx,
			fsdata.ColYear, fsdata.IdYear(year.Year), fsdata.ColBallot)
		if err != nil {
			return nil, err
		}
		for id, ballot := range ballots {
			parts := strings.Split(id, "#")
			voterName, department := parts[0], val.Department(parts[1])
			store.AddBallotDoc(year.Year, voterName, department, ballot)
		}

		awards, err := fsdata.GetAll[fsdata.AwardDoc](fss, ctx,
			fsdata.ColYear, fsdata.IdYear(year.Year), fsdata.ColAward)
		if err != nil {
			return nil, err
		}
		for id, award := range awards {
			department := val.Department(id)
			store.AddAwardDoc(year.Year, department, award)
		}
	}
	return store, nil
}
