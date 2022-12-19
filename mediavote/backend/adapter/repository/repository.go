package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v9"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/env"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/generic"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Repository struct {
	rootDB *gorm.DB
	rds    *redis.Client
}

// check interface implement
var _ port.Repository = &Repository{}

func NewRepository() (*Repository, error) {
	r := &Repository{}
	{
		db, err := gorm.Open(postgres.Open(env.PgDSN()), &gorm.Config{})
		if err != nil {
			return nil, ierr.InternalServerError(err) // TODO: add err type: InitError or ConnectError
		}
		if err := db.AutoMigrate(models...); err != nil {
			return nil, ierr.InternalServerError(err) // TODO: add err type: InitError or ConnectError
		}
		if !env.IsProd() {
			db = db.Debug()
		}
		r.rootDB = db
	}
	{
		r.rds = redis.NewClient(&redis.Options{
			Addr: env.RedisAddr(),
			DB:   env.RedisDB(),
		})
	}
	return r, nil
}

func (r *Repository) WithTx(ctx context.Context, fn func(context.Context) error, opts ...*sql.TxOptions) error {
	db := r.getDB(ctx)
	return db.Transaction(func(tx *gorm.DB) error {
		innerCtx := context.WithValue(ctx, dbCtxkey, tx)
		return fn(innerCtx)
	}, opts...)
}

var models = []interface{}{
	Ballot{},
	Nomination{},
	Ranking{},
	Voter{},
	Work{},
}

type ctxKey int

const dbCtxkey ctxKey = 1

func (r *Repository) getDB(ctx context.Context) *gorm.DB {
	db, ok := ctx.Value(dbCtxkey).(*gorm.DB)
	if !ok || db == nil {
		return r.rootDB.WithContext(ctx)
	}
	return db.WithContext(ctx)
}

type EntityRepository[ID, Entity, Query, Update, Model any] struct {
	*Repository

	ModelToEntity func(m *Model) *Entity
	EntityToModel func(e *Entity) *Model
	QueryToDB     func(db *gorm.DB, query *Query) *gorm.DB
	UpdateToDB    func(db *gorm.DB, update *Update) *gorm.DB
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) GetByID(ctx context.Context, id ID) (*Entity, error) {
	var m Model
	if err := er.getDB(ctx).Where("id = ?", id).Take(&m).Error; err != nil {
		return nil, err
	}
	return er.ModelToEntity(&m), nil
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) Search(ctx context.Context, query *Query) ([]*Entity, error) {
	var ms []*Model
	if err := er.QueryToDB(er.getDB(ctx), query).Find(&ms).Error; err != nil {
		return nil, err
	}
	return generic.Map(ms, er.ModelToEntity), nil
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) Create(ctx context.Context, entity *Entity) error {
	m := er.EntityToModel(entity)
	if err := er.getDB(ctx).Create(entity).Error; err != nil {
		return err
	}
	*entity = *(er.ModelToEntity(m))
	return nil
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) UpdateOne(ctx context.Context, id ID, update *Update) error {
	var m Model
	db := er.getDB(ctx).Model(m).Where("id = ?", id)
	if err := er.UpdateToDB(db, update).Error; err != nil {
		return err
	}
	return nil
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) UpdateMany(ctx context.Context, query *Query, update *Update) error {
	var m Model
	db := er.QueryToDB(er.getDB(ctx).Model(m), query)
	if err := er.UpdateToDB(db, update).Error; err != nil {
		return err
	}
	return nil
}

func (er EntityRepository[ID, Entity, Query, Update, Model]) Delete(ctx context.Context, id ID) error {
	var m Model
	if err := er.getDB(ctx).Where("id = ?", id).Delete(&m).Error; err != nil {
		return err
	}
	return nil
}

type CacheRepository[C port.Cacher] struct {
	*Repository
}

func (cr CacheRepository[C]) Set(ctx context.Context, value C) error {
	data := jsonMarshal(value)
	err := cr.rds.Set(ctx, value.Key(), string(data), time.Until(value.ExpireTime())).Err()
	return err
}

func (cr CacheRepository[C]) Get(ctx context.Context, key string) (C, error) {
	data, err := cr.rds.Get(ctx, key).Result()
	var c C
	if err != nil {
		return c, nil
	}
	err = json.Unmarshal([]byte(data), &c)
	return c, err
}
