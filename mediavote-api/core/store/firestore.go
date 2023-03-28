package store

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
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

	colYear       = "mediavote_years"
	colDepartment = "departments"
	colVoter      = "voters"
	colSession    = "sessions"
	colBallot     = "ballots"
	colAwards     = "awards"
)

var client = newClient()

func newClient() *firestore.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := firestore.NewClient(ctx, ProjectID)
	if err != nil {
		log.Fatal().Msgf("connect firestore: %v", err)
	}
	return client
}

func readDoc[T any](doc *firestore.DocumentSnapshot) *T {
	var t T
	if err := doc.DataTo(&t); err != nil {
		log.Fatal().Msgf("parse firestore document: %s", err)
	}
	return &t
}

func readDocs[T any](iter *firestore.DocumentIterator) ([]*T, error) {
	var ts []*T
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, terror.FirestoreError("read document iterator").Wrap(err)
		}
		ts = append(ts, readDoc[T](doc))
	}
	return ts, nil
}

func LoadDevData() {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()
	year := devYear()
	if _, err := client.Collection(colYear).Doc(year.ID()).Set(ctx, year); err != nil {
		log.Fatal().Msgf("loadDevData failed: %v", err)
	}
	depts := []*entity.Department{
		{
			Dept: entity.Anime,
			Works: []*entity.Work{
				{
					Name:       "彻夜之歌",
					OriginName: "よふかしのうた",
				},
				{
					Name:       "孤独摇滚！",
					OriginName: "ぼっち・ざ・ろっく！",
				},
				{
					Name:       "灵能100% III",
					OriginName: "モブサイコ100",
					Alias:      []string{"路人超能100 III"},
				},
			},
		},
		{
			Dept: entity.Game,
			Works: []*entity.Work{
				{
					Name:       "艾尔登法环",
					OriginName: "Elden Ring",
					Alias:      []string{"エルデンリング"},
				},
				{
					Name:       "战神：诸神黄昏",
					OriginName: "God of War: Ragnarök",
				},
				{
					Name:       "师父",
					OriginName: "Sifu",
				},
			},
		},
		{
			Dept: entity.MangaAndNovel,
			Works: []*entity.Work{
				{
					Name:       "继母的拖油瓶是我的前女友",
					OriginName: "継母の連れ子が元カノだった",
				},
				{
					Name:       "躲在超市后门抽烟的两人",
					OriginName: "スーパーの裏でヤニ吸うふたり",
					Alias:      []string{"在超市后门吸烟的故事", "スーパーの裏でヤニ吸う話"},
				},
				{
					Name:       "再见绘梨",
					OriginName: "さよなら絵梨",
				},
			},
		},
	}
	for _, dept := range depts {
		if err := SetDepartment(ctx, dept); err != nil {
			log.Fatal().Msgf("loadDevData failed: %v", err)
		}
	}
}

func devYear() *entity.Year {
	stage := entity.Stage(env.DevStage())
	now := time.Now()
	switch stage {
	case entity.StageNomination:
		return &entity.Year{
			Year:              2022,
			NominationStartAt: now.Add(-7 * 24 * time.Hour),
			VotingStartAt:     now.Add(7 * 24 * time.Hour),
			AwardStartAt:      now.Add(14 * 24 * time.Hour),
		}
	case entity.StageVoting:
		return &entity.Year{
			Year:              2022,
			NominationStartAt: now.Add(-14 * 24 * time.Hour),
			VotingStartAt:     now.Add(-7 * 24 * time.Hour),
			AwardStartAt:      now.Add(7 * 24 * time.Hour),
		}
	case entity.StageAward:
		return &entity.Year{
			Year:              2022,
			NominationStartAt: now.Add(-21 * 24 * time.Hour),
			VotingStartAt:     now.Add(-14 * 24 * time.Hour),
			AwardStartAt:      now.Add(-7 * 24 * time.Hour),
		}
	default:
		log.Fatal().Msgf("invalid stage: %s", stage)
		return nil
	}
}
