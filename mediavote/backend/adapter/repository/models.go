package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/lib/pq"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
	"gorm.io/gorm"
)

type Ballot struct {
	gorm.Model
	VoterID    uint              `gorm:"index:idx_ballot_voter_dp,unique,priority:1"`
	Department entity.Department `gorm:"size:15;index:idx_ballot_voter_dp,unique,priority:2"`
	Candidates []byte            `gorm:"type:jsonb"`
}

func (r *Repository) Ballot() port.EntityRepository[uint, entity.Ballot, port.BallotQuery, port.BallotUpdate] {
	return EntityRepository[uint, entity.Ballot, port.BallotQuery, port.BallotUpdate, Ballot]{
		Repository: r,
		ModelToEntity: func(m *Ballot) *entity.Ballot {
			return &entity.Ballot{
				ID:         m.ID,
				VoterID:    m.VoterID,
				Department: m.Department,
				Candidates: jsonUnmarshal[[]*entity.WorkRanking](m.Candidates),
			}
		},
		EntityToModel: func(e *entity.Ballot) *Ballot {
			return &Ballot{
				Model:      gorm.Model{ID: e.ID},
				VoterID:    e.VoterID,
				Department: e.Department,
				Candidates: jsonMarshal(e.Candidates),
			}
		},
		QueryToDB: func(db *gorm.DB, query *port.BallotQuery) *gorm.DB {
			db = whereEq(db, "voter_id", query.VoterID)
			db = whereEq(db, "department", query.Department)
			return db
		},
		UpdateToDB: func(db *gorm.DB, update *port.BallotUpdate) *gorm.DB {
			return updateCol(db, "candidates", update.Candidates)
		},
	}
}

type Nomination struct {
	gorm.Model
	VoterID    uint              `gorm:"index"`
	Department entity.Department `gorm:"size:15;index:idx_nomination_name_dp,unique,priority:2"`
	WorkName   string            `gorm:"index:idx_nomination_name_dp,unique,priority:1"`
	WorkID     sql.NullInt64
}

func (r *Repository) Nomination() port.EntityRepository[uint, entity.Nomination, port.NominationQuery, port.NominationUpdate] {
	return EntityRepository[uint, entity.Nomination, port.NominationQuery, port.NominationUpdate, Nomination]{
		Repository: r,
		ModelToEntity: func(m *Nomination) *entity.Nomination {
			return &entity.Nomination{
				ID:         m.ID,
				VoterID:    m.VoterID,
				Department: m.Department,
				WorkName:   m.WorkName,
				WorkID:     nullInt64ToIDPtr(m.WorkID),
			}
		},
		EntityToModel: func(e *entity.Nomination) *Nomination {
			return &Nomination{
				Model:      gorm.Model{ID: e.ID},
				VoterID:    e.VoterID,
				Department: e.Department,
				WorkName:   e.WorkName,
				WorkID:     idPtrToNullInt64(e.WorkID),
			}
		},
		QueryToDB: func(db *gorm.DB, query *port.NominationQuery) *gorm.DB {
			db = whereEq(db, "department", query.Department)
			db = whereEq(db, "voter_id", query.VoterID)
			db = whereIn(db, "work_name", query.WorkNames)
			return db
		},
		UpdateToDB: func(db *gorm.DB, update *port.NominationUpdate) *gorm.DB {
			db = updateCol(db, "work_name", update.WorkName)
			db = updateCol(db, "work_id", update.WorkID)
			return db
		},
	}
}

type Ranking struct {
	gorm.Model
	Department entity.Department `gorm:"size:15;unique"`
	Rankings   []byte            `gorm:"type:jsonb"`
}

func (r *Repository) Ranking() port.EntityRepository[uint, entity.Ranking, port.RankingQuery, port.RankingUpdate] {
	return EntityRepository[uint, entity.Ranking, port.RankingQuery, port.RankingUpdate, Ranking]{
		Repository: r,
		ModelToEntity: func(m *Ranking) *entity.Ranking {
			return &entity.Ranking{
				Department: m.Department,
				Rankings:   jsonUnmarshal[[]*entity.WorkRanking](m.Rankings),
			}
		},
		EntityToModel: func(e *entity.Ranking) *Ranking {
			return &Ranking{
				Model:      gorm.Model{},
				Department: e.Department,
				Rankings:   jsonMarshal(e.Rankings),
			}
		},
		QueryToDB: func(db *gorm.DB, query *port.RankingQuery) *gorm.DB {
			db = whereEq(db, "department", query.Department)
			return db
		},
		UpdateToDB: func(db *gorm.DB, update *port.RankingUpdate) *gorm.DB {
			db = updateCol(db, "rankings", jsonMarshal(update.Rankings))
			return db
		},
	}
}

func (r *Repository) Session() port.CacheRepository[entity.Session] {
	return CacheRepository[entity.Session]{
		Repository: r,
	}
}

type Voter struct {
	gorm.Model
	PinCode string `gorm:"size:7"`
	Name    string `gorm:"size:255;unique"`
}

func (r *Repository) Voter() port.EntityRepository[uint, entity.Voter, port.VoterQuery, port.VoterUpdate] {
	return EntityRepository[uint, entity.Voter, port.VoterQuery, port.VoterUpdate, Voter]{
		Repository: r,
		ModelToEntity: func(m *Voter) *entity.Voter {
			return &entity.Voter{
				ID:      m.ID,
				Name:    m.Name,
				PinCode: m.PinCode,
			}
		},
		EntityToModel: func(e *entity.Voter) *Voter {
			return &Voter{
				Model:   gorm.Model{ID: e.ID},
				PinCode: e.PinCode,
				Name:    e.Name,
			}
		},
		QueryToDB: func(db *gorm.DB, query *port.VoterQuery) *gorm.DB {
			db = whereEq(db, "name", query.Name)
			db = whereEq(db, "pin_code", query.Pin)
			return db
		},
		UpdateToDB: func(db *gorm.DB, update *port.VoterUpdate) *gorm.DB {
			return db
		},
	}
}

type Work struct {
	gorm.Model
	Department entity.Department `gorm:"size:15"`
	NameCN     string            `gorm:"size:255"`
	NameOrigin string            `gorm:"size:255"`
	Alias      pq.StringArray    `gorm:"type:text[][]"`
}

func (r *Repository) Work() port.EntityRepository[uint, entity.Work, port.WorkQuery, port.WorkUpdate] {
	return EntityRepository[uint, entity.Work, port.WorkQuery, port.WorkUpdate, Work]{
		Repository: r,
		ModelToEntity: func(m *Work) *entity.Work {
			return &entity.Work{
				ID:         m.ID,
				Department: m.Department,
				NameCN:     m.NameCN,
				NameOrigin: m.NameOrigin,
				Alias:      m.Alias,
			}
		},
		EntityToModel: func(e *entity.Work) *Work {
			return &Work{
				Model:      gorm.Model{ID: e.ID},
				Department: e.Department,
				NameCN:     e.NameCN,
				NameOrigin: e.NameOrigin,
				Alias:      e.Alias,
			}
		},
		QueryToDB: func(db *gorm.DB, query *port.WorkQuery) *gorm.DB {
			db = whereEq(db, "department", query.Department)
			return db
		},
		UpdateToDB: func(db *gorm.DB, update *port.WorkUpdate) *gorm.DB {
			db = updateCol(db, "name_cn", update.NameCN)
			db = updateCol(db, "name_origin", update.NameOrigin)
			db = updateCol(db, "alias", update.Alias)
			return db
		},
	}
}

func jsonMarshal(v any) []byte {
	bs, err := json.Marshal(v)
	if err != nil {
		panic(ierr.InternalServerError(err)) // TODO: add err type: InitError or ConnectError
	}
	return bs
}

func jsonUnmarshal[T any](data []byte) T {
	var t T
	if err := json.Unmarshal(data, &t); err != nil {
		panic(ierr.InternalServerError(err)) // TODO: add err type: InitError or ConnectError
	}
	return t
}

func updateCol[T any](db *gorm.DB, column string, value T) *gorm.DB {
	if reflect.ValueOf(&value).Elem().IsZero() { // TODO: test this
		return db
	}
	return db.Update(column, value)
}

func whereEq[T any](db *gorm.DB, column string, value T) *gorm.DB {
	if reflect.ValueOf(&value).Elem().IsZero() {
		return db
	}
	return db.Where(fmt.Sprintf("%s = ?", column), value)
}

func whereIn[T any](db *gorm.DB, column string, value []T) *gorm.DB {
	if reflect.ValueOf(&value).Elem().IsZero() {
		return db
	}
	return db.Where(fmt.Sprintf("%s in ?", column), value)
}

func idPtrToNullInt64(id *uint) sql.NullInt64 {
	if id == nil {
		return sql.NullInt64{Int64: 0, Valid: false}
	}
	return sql.NullInt64{Int64: int64(*id), Valid: true}
}

func nullInt64ToIDPtr(ni sql.NullInt64) *uint {
	if ni.Valid {
		id := uint(ni.Int64)
		return &id
	}
	return nil
}
