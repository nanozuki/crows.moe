package auth

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/pkg/ierr"
	"github.com/rs/zerolog/log"
)

type Service struct {
	Repository port.Repository
}

func (s *Service) NewVoter(ctx context.Context, name string) (*entity.Voter, *entity.Session, error) {
	if user := entity.CtxUserFromContext(ctx); user.VoterID != 0 {
		return nil, nil, ierr.AlreadyLoggedIn(user.Name)
	}
	voter, err := entity.NewVoter(name)
	if err != nil {
		return nil, nil, err
	}
	if err := s.Repository.Voter().Create(ctx, voter); err != nil {
		return nil, nil, err
	}
	log.Info().Msgf("new voter: %+v", voter)
	session := entity.NewSession(voter)
	if err := s.Repository.Session().Set(ctx, session); err != nil {
		return nil, nil, err
	}
	return voter, &session, nil
}

func (s *Service) LoginVoter(ctx context.Context, name, pin string) (*entity.Voter, *entity.Session, error) {
	if user := entity.CtxUserFromContext(ctx); user.VoterID != 0 {
		return nil, nil, ierr.AlreadyLoggedIn(user.Name)
	}
	voters, err := s.Repository.Voter().Search(ctx, &port.VoterQuery{Name: name, Pin: pin})
	if err != nil {
		return nil, nil, err
	}
	if len(voters) == 0 {
		return nil, nil, ierr.NameOrPinError(name, pin)
	}
	session := entity.NewSession(voters[0])
	if err := s.Repository.Session().Set(ctx, session); err != nil {
		return nil, nil, err
	}
	return voters[0], &session, nil
}

func (s *Service) GetSession(ctx context.Context, id string) (*entity.Session, error) {
	session, err := s.Repository.Session().Get(ctx, id)
	if err != nil {
		return nil, ierr.NotFound("session", ierr.F{"id": id})
	}
	return &session, nil
}
