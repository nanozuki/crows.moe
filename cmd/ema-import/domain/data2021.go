package domain

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gocarina/gocsv"
)

type Data2021 struct {
	Ballots []*Ballot2021
	Votes   []*Votes2021
	Works   []*Works2021
}

func NewData2021FromDirectory(dir string) (*Data2021, error) {
	data := &Data2021{}
	items := []struct {
		file string
		ptr  interface{}
	}{
		{"ballots.csv", &data.Ballots},
		{"votes.csv", &data.Votes},
		{"works.csv", &data.Works},
	}
	for _, item := range items {
		f, err := os.Open(dir + "/" + item.file)
		if err != nil {
			return nil, fmt.Errorf("failed to open %s: %w", dir+"/"+item.file, err)
		}
		if err := gocsv.UnmarshalFile(f, item.ptr); err != nil {
			return nil, fmt.Errorf("failed to unmarshal %s: %w", item.file, err)
		}
	}
	fmt.Println(data)
	return data, nil
}

func (d *Data2021) String() string {
	lines := []string{}
	lines = append(lines, "Ballots:")
	for _, ballot := range d.Ballots {
		lines = append(lines, fmt.Sprintf("\t- %+v", ballot))
	}
	lines = append(lines, "Votes:")
	for _, vote := range d.Votes {
		lines = append(lines, fmt.Sprintf("\t- %+v", vote))
	}
	lines = append(lines, "Works:")
	for _, work := range d.Works {
		lines = append(lines, fmt.Sprintf("\t- %+v", work))
	}
	return fmt.Sprintf("Data2021:\n%s\n", strings.Join(lines, "\n"))
}

func (d *Data2021) ToEMAData() (EMAData, error) {
	yearData := &YearData{
		Year:  2021,
		Works: map[Department][]*Work{},
	}
	voterNames := map[string]string{} // {id: name}
	for _, vote := range d.Votes {
		voterNames[vote.Id] = vote.UserName
	}
	works := map[int]*Work{} // {id: work}
	for _, work := range d.Works {
		works[work.Id] = &Work{Name: work.Name}
		dept := work.Department.ToEMA()
		yearData.Works[dept] = append(yearData.Works[dept], works[work.Id])
	}

	for _, ballot := range d.Ballots {
		bd := &BallotData{
			Department: ballot.Department.ToEMA(),
			VoterName:  voterNames[ballot.VoteId],
		}
		if bd.VoterName == "" {
			return nil, fmt.Errorf("vote id %s not found\n", ballot.VoteId)
		}
		for _, c := range ballot.Candidates {
			var work *Work
			if c.Id != 0 {
				work = works[c.Id]
				names := append([]string{work.Name}, work.Alias...)
				has := false
				for _, n := range names {
					if n == c.Name {
						has = true
						break
					}
				}
				if !has {
					work.Alias = append(work.Alias, c.Name)
				}
			} else {
				work = &Work{Name: c.Name}
				yearData.Works[bd.Department] = append(yearData.Works[bd.Department], work)
			}
			bd.Rankings = append(bd.Rankings, &RankedWorkName{
				Ranking:  c.Ranking,
				WorkName: work.Name,
			})
		}
		yearData.Ballots = append(yearData.Ballots, bd)
	}

	return EMAData{yearData}, nil
}

type Ballot2021 struct {
	Id         int          `csv:"id"`
	VoteId     string       `csv:"vote_id"`
	Department Dept2021     `csv:"department"`
	Candidates Rankings2021 `csv:"candidates"`
}

type Votes2021 struct {
	Id       string `csv:"id"`
	UserName string `csv:"user_name"`
}

type Works2021 struct {
	Id         int      `csv:"id"`
	Department Dept2021 `csv:"department"`
	Name       string   `csv:"name"`
}

type RandedWork2021 struct {
	Id      int    `json:"id"`
	Ranking int    `json:"ranking"`
	Name    string `json:"name"`
}

func (w *RandedWork2021) String() string {
	return fmt.Sprintf("<%d:%s>", w.Ranking, w.Name)
}

type Rankings2021 []*RandedWork2021

func (r *RandedWork2021) MarshalCSV() (string, error) {
	j, err := json.Marshal(r)
	return string(j), err
}

func (r *RandedWork2021) UnmarshalCSV(csv string) error {
	return json.Unmarshal([]byte(csv), r)
}

type Dept2021 uint

const (
	_                   Dept2021 = iota
	Dept2021_TVAnime             // 1
	Dept2021_NonTVAnime          // 2
	Dept2021_Manga               // 3
	Dept2021_Game                // 4
	Dept2021_Novel               // 5
)

func (d Dept2021) ToEMA() Department {
	switch d {
	case Dept2021_TVAnime:
		return DeptTVAnime
	case Dept2021_NonTVAnime:
		return DeptNonTVAnime
	case Dept2021_Manga:
		return DeptManga
	case Dept2021_Game:
		return DeptGame
	case Dept2021_Novel:
		return DeptNovel
	default:
		return ""
	}
}

func (d Dept2021) String() string {
	return string(d.ToEMA())
}
