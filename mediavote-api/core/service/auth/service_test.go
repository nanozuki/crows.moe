package auth_test

import (
	"context"
	"testing"
	"time"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/tools/inj"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestService_NewVoter(t *testing.T) {
	s, err := inj.InitAuthService()
	require.NoError(t, err, "InitAuthService")
	require.NoError(t, s.Repository.Reset(), "Repository.Reset()")
	type args struct {
		name    string
		ctxUser entity.CtxUser
	}
	type want struct {
		id   uint
		name string
	}
	tests := []struct {
		name    string
		args    args
		want    want
		wantErr bool
	}{
		{
			name:    "new user",
			args:    args{name: "nanozuki"},
			want:    want{id: 1, name: "nanozuki"},
			wantErr: false,
		},
		{
			name:    "duplicated user",
			args:    args{name: "nanozuki"},
			wantErr: true,
		},
		{
			name: "already login",
			args: args{
				name:    "nanozuki1",
				ctxUser: entity.CtxUser{VoterID: 1, Name: "nanozuki"},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			begin := time.Now()
			ctx, cancel := context.WithTimeout(tt.args.ctxUser.SetCtx(context.Background()), 1*time.Minute)
			defer cancel()
			gotVoter, gotSession, err := s.NewVoter(ctx, tt.args.name)
			if (err != nil) != tt.wantErr {
				t.Errorf("Service.NewVoter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if err != nil {
				return
			}
			// voter
			assert.Equal(t, gotVoter.ID, tt.want.id)
			assert.Equal(t, gotVoter.Name, tt.want.name)
			assert.Len(t, gotVoter.PinCode, 4)
			// session
			assert.NotEmpty(t, gotSession.ID)
			assert.True(t, gotSession.ExpireAt.After(begin.Add(entity.SessionExpireTime)))
			assert.Equal(t, gotSession.VoterID, tt.want.id)
			assert.Equal(t, gotSession.VoterName, tt.want.name)
		})
	}
}

func TestService_LoginVoter(t *testing.T) {
	s, err := inj.InitAuthService()
	require.NoError(t, err, "InitAuthService")
	require.NoError(t, s.Repository.Reset(), "Repository.Reset()")
	params := struct {
		id   uint
		name string
		pin  string
	}{1, "nanozuki", ""}

	t.Run("normal login", func(t *testing.T) {
		begin := time.Now()
		ctx, cancel := context.WithTimeout((&entity.CtxUser{}).SetCtx(context.Background()), 1*time.Minute)
		defer cancel()
		voter, _, err := s.NewVoter(ctx, params.name)
		require.NoError(t, err)
		params.pin = voter.PinCode
		voter, session, err := s.LoginVoter(ctx, params.name, params.pin)
		require.NoError(t, err)

		// voter
		assert.Equal(t, voter.ID, params.id)
		assert.Equal(t, voter.Name, params.name)
		assert.Len(t, voter.PinCode, 4)
		// session
		assert.NotEmpty(t, session.ID)
		assert.True(t, session.ExpireAt.After(begin.Add(entity.SessionExpireTime)))
		assert.Equal(t, session.VoterID, params.id)
		assert.Equal(t, session.VoterName, params.name)
	})

	t.Run("wrong name", func(t *testing.T) {
		ctx, cancel := context.WithTimeout((&entity.CtxUser{}).SetCtx(context.Background()), 1*time.Minute)
		defer cancel()
		_, _, err = s.LoginVoter(ctx, params.name+"x", params.pin)
		require.Error(t, err)
	})

	t.Run("wrong passwd", func(t *testing.T) {
		ctx, cancel := context.WithTimeout((&entity.CtxUser{}).SetCtx(context.Background()), 1*time.Minute)
		defer cancel()
		_, _, err = s.LoginVoter(ctx, params.name, params.pin+"x")
		require.Error(t, err)
	})

	t.Run("already login", func(t *testing.T) {
		user := &entity.CtxUser{VoterID: params.id, Name: params.name}
		ctx, cancel := context.WithTimeout(user.SetCtx(context.Background()), 1*time.Minute)
		defer cancel()
		_, _, err = s.LoginVoter(ctx, params.name, params.pin)
		require.Error(t, err)
	})
}

func TestService_GetSession(t *testing.T) {
	s, err := inj.InitAuthService()
	require.NoError(t, err, "InitAuthService")
	require.NoError(t, s.Repository.Reset(), "Repository.Reset()")
	params := struct{ name string }{"nanozuki"}

	t.Run("normal", func(t *testing.T) {
		ctx, cancel := context.WithTimeout((&entity.CtxUser{}).SetCtx(context.Background()), 1*time.Minute)
		defer cancel()
		_, session, err := s.NewVoter(ctx, params.name)
		require.NoError(t, err)
		got, err := s.GetSession(ctx, session.ID.String())
		assert.NoError(t, err)
		session.ExpireAt = session.ExpireAt.In(time.UTC) // changed by database
		assert.Equal(t, session, got)
	})
}
