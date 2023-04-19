package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/nanozuki/crows.moe/vote2021/backend/entity"
	"github.com/nanozuki/crows.moe/vote2021/backend/httpapi"
	"github.com/nanozuki/crows.moe/vote2021/backend/repo"
	"github.com/nanozuki/crows.moe/vote2021/backend/service"
	"github.com/nanozuki/crows.moe/vote2021/backend/util"
)

var (
	export     bool
	department entity.Department
)

func init() {
	flag.BoolVar(&export, "export", false, "export ballots")
	flag.UintVar((*uint)(&department), "d", 0, "department")
}

func main() {
	flag.Parse()
	if export {
		cmdExportBallots()
	} else {
		cmdRunServer()
	}
}

func cmdRunServer() {
	repo := util.Must(repo.NewRepository())
	srv := httpapi.NewServer(&service.Service{Repo: repo})
	log.Fatal(srv.Echo.Start("[::]:8000"))
}

type ExportData struct {
	Ballots []ExportBallot `json:"payload"`
}

type ExportBallot struct {
	ID    string       `json:"id"`
	Works []ExportWork `json:"votes"`
}

type ExportWork struct {
	ID      uint `json:"id"`
	Ranking uint `json:"ranking"`
}

func cmdExportBallots() {
	if !department.IsValid() {
		log.Fatalf("invalid department: '%v'", department)
	}
	svc := service.Service{
		Repo: util.Must(repo.NewRepository()),
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	ballots := util.Must(svc.FindBallots(ctx, department))
	ed := ExportData{Ballots: []ExportBallot{}}
	for _, b := range ballots {
		works := []ExportWork{}
		for _, cd := range b.Candidates {
			works = append(works, ExportWork{
				ID:      cd.ID,
				Ranking: cd.Ranking,
			})
		}
		ed.Ballots = append(ed.Ballots, ExportBallot{
			ID:    b.VoteID.String(),
			Works: works,
		})
	}
	data := util.Must(json.Marshal(ed))
	fmt.Println(string(data))
}
