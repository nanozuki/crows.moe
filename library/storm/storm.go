// package storm is an helper to make a ORM for Firestore
package storm

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/cmd/ema-import/pkg/terror"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"
)

type Root struct {
	client *firestore.Client
}

func NewRoot(ctx context.Context, projectID string) (Root, error) {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return Root{}, fmt.Errorf("connect firestore: %v", err)
	}
	return Root{client}, nil
}

type DMaker[Model any, Doc D[Model]] func(BaseD[Model]) Doc

type C[Model any, Doc D[Model]] struct {
	ref    *firestore.CollectionRef
	dMaker DMaker[Model, Doc]
}

func RootC[Model any, Doc D[Model]](root Root, path string, maker DMaker[Model, Doc]) C[Model, Doc] {
	return C[Model, Doc]{root.client.Collection(path), maker}
}

func SubC[Model any, SubModel any, Doc D[Model], SubDoc D[SubModel]](doc Doc, path string, maker DMaker[SubModel, SubDoc]) C[SubModel, SubDoc] {
	base := doc.Base()
	return C[SubModel, SubDoc]{base.ref.Collection(path), maker}
}

func (c C[Model, Doc]) Doc(id string) Doc {
	base := BaseD[Model]{c.ref.Doc(id)}
	return c.dMaker(base)
}

func (c C[Model, Doc]) GetAll() ([]*Model, error) {
	iter := c.ref.Documents(context.Background())
	var models []*Model
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, terror.FirestoreError("get all documents").Wrap(err)
		}
		var model Model
		if err := doc.DataTo(&model); err != nil {
			log.Fatal().Msgf("parse firestore document: %s", err)
		}
		models = append(models, &model)
	}
	return models, nil
}

type D[Model any] interface {
	Base() BaseD[Model]
	Get(ctx context.Context) (*Model, error)
	Set(ctx context.Context, model *Model) error
}

type BaseD[Model any] struct {
	ref *firestore.DocumentRef
}

func NewBaseD[Model any](ref *firestore.DocumentRef) BaseD[Model] {
	return BaseD[Model]{ref}
}

func (d BaseD[Model]) Base() BaseD[Model] {
	return d
}

func (d BaseD[Model]) Get(ctx context.Context) (*Model, error) {
	doc, err := d.ref.Get(ctx)
	if err != nil {
		return nil, terror.FirestoreError("get document").Wrap(err)
	}
	var model Model
	if err := doc.DataTo(&model); err != nil {
		log.Fatal().Msgf("parse firestore document: %s", err)
	}
	return &model, nil
}

func (d BaseD[Model]) Set(ctx context.Context, model *Model) error {
	if _, err := d.ref.Set(ctx, model); err != nil {
		return terror.FirestoreError("set document").Wrap(err)
	}
	return nil
}

/* Example
type Store struct {
	root storm.Root
}

func (s *Store) Year() storm.C[entity.Year, Year] {
	return storm.RootC(s.root, colYear, func(base storm.BaseD[entity.Year]) Year {
		return Year{base}
	})
}

type Year struct {
	storm.BaseD[entity.Year]
}

func (y Year) Department() storm.C[entity.Department, Department] {
	return storm.SubC[entity.Year](y, colDepartment, func(base storm.BaseD[entity.Department]) Department {
		return Department{base}
	})
}

func GetCurrentYearAnimeDepartment(ctx context.Context, s *Store) (*entity.Department, error) {
	dept, err := s.Year().Doc("2022").Department().Doc("anime").Get(ctx)
	return dept, err
}

type Department struct {
	storm.BaseD[entity.Department]
}

type Voter struct {
	storm.BaseD[entity.Voter]
}

type Session struct {
	storm.BaseD[entity.Session]
}

type Ballot struct {
	storm.BaseD[entity.Ballot]
}

type Award struct {
	storm.BaseD[entity.Award]
}
*/
