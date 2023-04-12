package schulze

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
)

func Compute(ctx context.Context, ballots []*entity.Ballot) (*entity.Awards, error) {
	request, idMap := makeRequest(ballots)
	response, err := getComputeResult(ctx, request)
	if err != nil {
		return nil, err
	}
	awards := makeAwards(response, idMap)
	awards.Dept = ballots[0].Dept
	return awards, nil
}

func makeRequest(ballots []*entity.Ballot) (Request, map[int]string) {
	idMap := map[int]string{}
	nameMap := map[string]int{}
	lastID := 1
	var request Request
	for _, ballot := range ballots {
		b := Ballot{ID: ballot.Voter}
		for _, item := range ballot.Rankings {
			if id, ok := nameMap[item.WorkName]; ok {
				b.Votes = append(b.Votes, Vote{ID: id, Ranking: item.Ranking})
			} else {
				nameMap[item.WorkName] = lastID
				idMap[lastID] = item.WorkName
				b.Votes = append(b.Votes, Vote{ID: lastID, Ranking: item.Ranking})
				lastID++
			}
		}
		request.Payload = append(request.Payload, b)
	}
	return request, idMap
}

func makeAwards(response Response, idMap map[int]string) *entity.Awards {
	awards := &entity.Awards{}
	for ranking, ids := range response {
		for _, id := range ids {
			awards.Rankings = append(awards.Rankings, entity.RankingItem{
				Ranking:  ranking + 1,
				WorkName: idMap[id],
			})
		}
	}
	return awards
}
