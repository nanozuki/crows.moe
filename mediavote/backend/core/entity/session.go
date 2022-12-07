package entity

import (
	"context"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Session struct {
	ID        uuid.UUID `gorm:"primaryKey;size=16"`
	ExpireAt  time.Time `gorm:"index"`
	VoterID   uint
	VoterName string
}

const SessionExpireTime = time.Hour * 24 * 30

func NewSession(voter *Voter) Session {
	return Session{
		ID:        uuid.NewV4(),
		ExpireAt:  time.Now().Add(SessionExpireTime),
		VoterID:   voter.ID,
		VoterName: voter.Name,
	}
}

type contextKey string

var userCtxKey = contextKey("user")

// A stand-in for our database backed user object
type CtxUser struct {
	VoterID uint
	Name    string
	IsAdmin bool
}

func NewFromSession(session *Session) *CtxUser {
	return &CtxUser{
		VoterID: session.VoterID,
		Name:    session.VoterName,
	}
}

func CtxUserFromContext(ctx context.Context) *CtxUser {
	raw, _ := ctx.Value(userCtxKey).(*CtxUser)
	return raw
}

func (u *CtxUser) SetCtx(ctx context.Context) context.Context {
	return context.WithValue(ctx, userCtxKey, u)
}
