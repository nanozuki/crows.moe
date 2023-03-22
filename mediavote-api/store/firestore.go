package store

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
)

const ProjectID = "crows-moe"

var client = newClient()

func newClient() *firestore.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := firestore.NewClient(ctx, ProjectID)
	if err != nil {
		log.Fatal().Msgf("connect firestore: %v", err)
	}
	if env.Environment() == env.EnvDev {
		loadDevData(client)
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

func loadDevData(client *firestore.Client) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Minute)
	defer cancel()
	now := time.Now()
	year := &Year{
		Year:              2022,
		NominationStartAt: now.Add(-7 * 24 * time.Hour),
		VotingStartAt:     now.Add(7 * 24 * time.Hour),
		AwardStartAt:      now.Add(14 * 24 * time.Hour),
	}
	if _, err := client.Collection(ColYear).Doc(year.ID()).Set(ctx, year); err != nil {
		log.Fatal().Msgf("loadDevData failed: %v", err)
	}
}
