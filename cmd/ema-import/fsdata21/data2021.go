package fsdata21

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gocarina/gocsv"
	"github.com/nanozuki/crows.moe/cmd/ema-import/fsdata"
	"github.com/nanozuki/crows.moe/cmd/ema-import/val"
)

type Data struct {
	Ballots []*Ballot
	Votes   []*Votes
	Works   []*Works
}

func NewDataFromDirectory(dir string) (*Data, error) {
	data := &Data{}
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

func (d *Data) String() string {
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

func (d *Data) ToEMAData() (fsdata.EMAData, error) {
	yearData := &fsdata.YearData{
		Year:  2021,
		Works: map[val.Department][]*fsdata.Work{},
	}
	voterNames := map[string]string{} // {id: name}
	for _, vote := range d.Votes {
		voterNames[vote.Id] = vote.UserName
	}
	works := map[int]*fsdata.Work{} // {id: work}
	for _, work := range d.Works {
		works[work.Id] = &fsdata.Work{Name: work.Name}
		dept := work.Department.ToEMA()
		yearData.Works[dept] = append(yearData.Works[dept], works[work.Id])
	}

	for _, ballot := range d.Ballots {
		bd := &fsdata.BallotData{
			Department: ballot.Department.ToEMA(),
			VoterName:  voterNames[ballot.VoteId],
		}
		if bd.VoterName == "" {
			return nil, fmt.Errorf("vote id %s not found\n", ballot.VoteId)
		}
		for _, c := range ballot.Candidates {
			var work *fsdata.Work
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
				work = &fsdata.Work{Name: c.Name}
				yearData.Works[bd.Department] = append(yearData.Works[bd.Department], work)
			}
			bd.Rankings = append(bd.Rankings, &fsdata.RankedWorkName{
				Ranking:  c.Ranking,
				WorkName: work.Name,
			})
		}
		yearData.Ballots = append(yearData.Ballots, bd)
	}

	return fsdata.EMAData{yearData}, nil
}

type Ballot struct {
	Id         int      `csv:"id"`
	VoteId     string   `csv:"vote_id"`
	Department Dept     `csv:"department"`
	Candidates Rankings `csv:"candidates"`
}

type Votes struct {
	Id       string `csv:"id"`
	UserName string `csv:"user_name"`
}

type Works struct {
	Id         int    `csv:"id"`
	Department Dept   `csv:"department"`
	Name       string `csv:"name"`
}

type RandedWork struct {
	Id      int    `json:"id"`
	Ranking int    `json:"ranking"`
	Name    string `json:"name"`
}

func (w *RandedWork) String() string {
	return fmt.Sprintf("<%d:%s>", w.Ranking, w.Name)
}

type Rankings []*RandedWork

func (r *RandedWork) MarshalCSV() (string, error) {
	j, err := json.Marshal(r)
	return string(j), err
}

func (r *RandedWork) UnmarshalCSV(csv string) error {
	return json.Unmarshal([]byte(csv), r)
}

type Dept uint

const (
	_              Dept = iota
	DeptTVAnime         // 1
	DeptNonTVAnime      // 2
	DeptManga           // 3
	DeptGame            // 4
	DeptNovel           // 5
)

func (d Dept) ToEMA() val.Department {
	switch d {
	case DeptTVAnime:
		return val.DeptTVAnime
	case DeptNonTVAnime:
		return val.DeptNonTVAnime
	case DeptManga:
		return val.DeptManga
	case DeptGame:
		return val.DeptGame
	case DeptNovel:
		return val.DeptNovel
	default:
		return ""
	}
}

func (d Dept) String() string {
	return string(d.ToEMA())
}
