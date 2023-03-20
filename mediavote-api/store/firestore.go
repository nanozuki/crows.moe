package store

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
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
