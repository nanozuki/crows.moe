package entity

import (
	"context"
	"time"

	"github.com/rs/zerolog/log"
	uuid "github.com/satori/go.uuid"
)

type Session struct {
	ID        uuid.UUID `json:"id,omitempty"`
	ExpireAt  time.Time `json:"expire_at,omitempty"`
	VoterID   uint      `json:"voter_id,omitempty"`
	VoterName string    `json:"voter_name,omitempty"`
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

func (s Session) Key() string {
	return s.ID.String()
}

func (s Session) ExpireTime() time.Time {
	return s.ExpireAt.Add(5 * time.Second)
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
	raw, ok := ctx.Value(userCtxKey).(*CtxUser)
	log.Info().Msgf("get user from context, user=%v, ok=%v", raw, ok)
	if !ok {
		return &CtxUser{}
	}
	return raw
}

func (u *CtxUser) SetCtx(ctx context.Context) context.Context {
	return context.WithValue(ctx, userCtxKey, u)
}
