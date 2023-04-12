package schulze

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
)

func Compute(ctx context.Context, ballots []*entity.Ballot) ([]*entity.RankingItem, error) {
	request, idMap := makeRequest(ballots)
	response, err := getComputeResult(ctx, request)
	if err != nil {
		return nil, err
	}
	items := makeAwards(response, idMap)
	return items, nil
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

func makeAwards(response Response, idMap map[int]string) []*entity.RankingItem {
	var items []*entity.RankingItem
	for _, ids := range response {
		ranking := len(items)
		for _, id := range ids {
			items = append(items, &entity.RankingItem{
				Ranking:  ranking + 1,
				WorkName: idMap[id],
			})
		}
	}
	return items
}
