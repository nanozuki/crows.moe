package fsdata

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/cmd/ema-import/val"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
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

	ColYear       = "mediavote_years"
	ColDepartment = "departments"
	ColVoter      = "voters"
	ColBallot     = "ballots"
	ColAward      = "awards"
)

type Store struct {
	client *firestore.Client
	dryRun bool
}

func NewStore(dryRun bool) *Store {
	client, err := firestore.NewClient(context.Background(), ProjectID)
	if err != nil {
		log.Fatal().Msgf("connect firestore: %v", err)
	}
	return &Store{client, dryRun}
}

func (s *Store) Set(ctx context.Context, doc any, path ...string) {
	if len(path)%2 != 0 {
		log.Fatal().Msgf("invalid set path: %s", strings.Join(path, "."))
	}
	if s.dryRun {
		docJson, _ := json.MarshalIndent(doc, "", "    ")
		fmt.Println("----")
		fmt.Printf("SET %s:\n", strings.Join(path, "."))
		fmt.Println(string(docJson))
		return
	}
	var ref *firestore.DocumentRef
	for i := 0; i*2+1 < len(path); i += 1 {
		if ref == nil {
			ref = s.client.Collection(path[i*2]).Doc(path[i*2+1])
		} else {
			ref = ref.Collection(path[i*2]).Doc(path[i*2+1])
		}
	}
	_, err := ref.Set(ctx, doc)
	if err != nil {
		log.Fatal().Msgf("set %s: %v", strings.Join(path, "."), err)
	}
}

func GetOne[T any](s *Store, ctx context.Context, path ...string) (*T, error) {
	if len(path)%2 != 0 {
		log.Fatal().Msgf("invalid set path: %s", strings.Join(path, "."))
	}
	var ref *firestore.DocumentRef
	for i := 0; i*2+1 < len(path); i += 1 {
		if ref == nil {
			ref = s.client.Collection(path[i*2]).Doc(path[i*2+1])
		} else {
			ref = ref.Collection(path[i*2]).Doc(path[i*2+1])
		}
	}
	doc, err := ref.Get(ctx)
	if err != nil {
		return nil, err
	}
	var result T
	if err := doc.DataTo(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

type Result[T any] struct {
	Id  string
	Doc *T
}

func GetAll[T any](s *Store, ctx context.Context, path ...string) ([]Result[T], error) {
	if len(path)%2 != 1 {
		log.Fatal().Msgf("invalid set path: %s", strings.Join(path, "."))
	}

	var ref *firestore.CollectionRef = s.client.Collection(path[0])
	for i := 0; i*2+2 < len(path); i += 1 {
		ref = ref.Doc(path[i*2+1]).Collection(path[i*2+2])
	}

	iter := ref.Documents(ctx)
	var results []Result[T]
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var result T
		if err := doc.DataTo(&result); err != nil {
			return nil, err
		}
		results = append(results, Result[T]{doc.Ref.ID, &result})
	}
	return results, nil
}

func (s *Store) ImportEMAData(ctx context.Context, data EMAData) {
	for _, yearData := range data {
		s.importYearData(ctx, yearData)
	}
}

func (s *Store) importYearData(ctx context.Context, data *YearData) {
	var departments []val.Department
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
	s.Set(ctx, doc, ColYear, IdYear(data.Year))

	s.importWorks(ctx, data.Year, data.Works)
	voters := s.importBallots(ctx, data.Year, data)
	s.importVoters(ctx, data.Year, voters)
	s.importAwards(ctx, data.Year, data)
}

func (s *Store) importWorks(ctx context.Context, year int, datas map[val.Department][]*Work) {
	for dept, works := range datas {
		doc := &DepartmentDoc{Works: works}
		s.Set(ctx, doc, ColYear, IdYear(year), ColDepartment, IdDept(dept))
	}
}

func (s *Store) importBallots(ctx context.Context, year int, data *YearData) []*VoterDoc {
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
		s.Set(ctx, doc, ColYear, IdYear(year), ColBallot, IdBallot(ballot))
		voterNames[ballot.VoterName] = struct{}{}
	}
	var voters []*VoterDoc
	for name := range voterNames {
		voters = append(voters, &VoterDoc{Name: name, PinCode: "00000"})
	}
	return voters
}

func (s *Store) importVoters(ctx context.Context, year int, voters []*VoterDoc) {
	for _, voter := range voters {
		s.Set(ctx, voter, ColYear, IdYear(year), ColVoter, voter.Name)
	}
}

func (s *Store) importAwards(ctx context.Context, year int, data *YearData) {
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
		s.Set(ctx, doc, ColYear, IdYear(year), ColAward, IdDept(dept))
	}
}
