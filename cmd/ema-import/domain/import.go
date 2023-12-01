package domain

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/rs/zerolog/log"
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
	ProjectID = "crows-moe"

	colYear       = "mediavote_years"
	colDepartment = "departments"
	colVoter      = "voters"
	colSession    = "sessions"
	colBallot     = "ballots"
	colAward      = "awards"
)

type Importer struct {
	client *firestore.Client
	dryRun bool
}

func NewImporter(dryRun bool) *Importer {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := firestore.NewClient(ctx, ProjectID)
	if err != nil {
		log.Fatal().Msgf("connect firestore: %v", err)
	}
	return &Importer{client, dryRun}
}

func (ip *Importer) set(ctx context.Context, doc any, path ...string) {
	if len(path)%2 != 0 {
		log.Fatal().Msgf("invalid set path: %s", strings.Join(path, "."))
	}
	if ip.dryRun {
		docJson, _ := json.MarshalIndent(doc, "", "    ")
		fmt.Println("----")
		fmt.Printf("SET %s:\n", strings.Join(path, "."))
		fmt.Println(string(docJson))
		return
	}
	var ref *firestore.DocumentRef
	for i := 0; i*2+1 < len(path); i += 1 {
		if ref == nil {
			ref = ip.client.Collection(path[i*2]).Doc(path[i*2+1])
		} else {
			ref = ref.Collection(path[i*2]).Doc(path[i*2+1])
		}
	}
	_, err := ref.Set(ctx, doc)
	if err != nil {
		log.Fatal().Msgf("set %s: %v", strings.Join(path, "."), err)
	}
}

func (ip *Importer) ImportEMAData(ctx context.Context, data EMAData) {
	for _, yearData := range data {
		ip.importYearData(ctx, yearData)
	}
}

func (ip *Importer) importYearData(ctx context.Context, data *YearData) {
	var departments []Department
	for dept := range data.Works {
		departments = append(departments, dept)
	}
	doc := &YearDoc{
		Year:              data.Year,
		NominationStartAt: data.NominationStartAt.Time(),
		VotingStartAt:     data.VotingStartAt.Time(),
		AwardStartAt:      data.AwardStartAt.Time(),
		Departments:       departments,
	}
	ip.set(ctx, doc, colYear, idYear(data.Year))

	ip.importWorks(ctx, data.Year, data.Works)
	voters := ip.importBallots(ctx, data.Year, data)
	ip.importVoters(ctx, data.Year, voters)
	ip.importAwards(ctx, data.Year, data)
}

func (ip *Importer) importWorks(ctx context.Context, year int, datas map[Department][]*Work) {
	for dept, works := range datas {
		doc := &DepartmentDoc{Works: works}
		ip.set(ctx, doc, colYear, idYear(year), colDepartment, idDept(dept))
	}
}

func (ip *Importer) importBallots(ctx context.Context, year int, data *YearData) []*VoterDoc {
	voterNames := map[string]struct{}{}
	for _, ballot := range data.Ballots {
		if len(ballot.Rankings) == 0 {
			continue
		}
		for _, ranking := range ballot.Rankings {
			work := data.FindWork(ballot.Department, ranking.WorkName)
			if work == nil {
				log.Fatal().Msgf("work not found: %s", ranking.WorkName)
			}
		}
		doc := &BallotDoc{Rankings: ballot.Rankings}
		ip.set(ctx, doc, colYear, idYear(year), colBallot, idBallot(ballot))
		voterNames[ballot.VoterName] = struct{}{}
	}
	var voters []*VoterDoc
	for name := range voterNames {
		voters = append(voters, &VoterDoc{Name: name, PinCode: "00000"})
	}
	return voters
}

func (i *Importer) importVoters(ctx context.Context, year int, voters []*VoterDoc) {
	for _, voter := range voters {
		i.set(ctx, voter, colYear, idYear(year), colVoter, voter.Name)
	}
}

func (i *Importer) importAwards(ctx context.Context, year int, data *YearData) {
	for dept, award := range data.Awards {
		rankings := make([]*RankedWork, len(award.Rankings))
		for i, ranking := range award.Rankings {
			work := data.FindWork(dept, ranking.WorkName)
			if work == nil {
				log.Fatal().Msgf("work not found: %s", ranking.WorkName)
			}
			rankings[i] = &RankedWork{
				Ranking: ranking.Ranking,
				Work:    work,
			}
		}
		doc := &AwardDoc{Rankings: rankings}
		i.set(ctx, doc, colYear, idYear(year), colAward, idDept(dept))
	}
}
