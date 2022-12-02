package nomination

import (
	"context"
	"errors"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/val"
)

type Service struct {
	Repository port.Repository
}

func (s *Service) NewNomination(ctx context.Context, input *entity.NominationInput) (*entity.Nomination, error) {
	nomi, err := entity.NewNomination(input)
	if err != nil {
		return nil, err
	}
	if err := s.Repository.Nomination().Create(ctx, nomi); err != nil {
		return nil, err
	}
	return nomi, nil
}

func (s *Service) ListDpNominations(ctx context.Context, department val.Department) ([]*entity.Nomination, error) {
	return s.Repository.Nomination().Search(ctx, &port.NominationQuery{Department: department})
}

func (s *Service) ListVoterNominations(ctx context.Context, voterID uint) ([]*entity.Nomination, error) {
	return s.Repository.Nomination().Search(ctx, &port.NominationQuery{VoterID: voterID})
}

func (s *Service) EditNomination(ctx context.Context, voterID, nomiID uint, workName string) (*entity.Nomination, error) {
	nomi, err := s.Repository.Nomination().GetByID(ctx, nomiID)
	if err != nil {
		return nil, err
	}
	if nomi.VoterID != voterID {
		return nil, errors.New("not your nomination") // TODO
	}
	if !nomi.Edit(workName) {
		return nomi, nil
	}
	return nomi, s.Repository.Nomination().Update(ctx, nomiID, &port.NominationUpdate{
		WorkName: nomi.WorkName,
		WorkID:   nomi.WorkID,
	})
}

func (s *Service) DeleteNomination(ctx context.Context, voterID, nomiID uint) error {
	nomi, err := s.Repository.Nomination().GetByID(ctx, nomiID)
	if err != nil {
		return err
	}
	if nomi.VoterID != voterID {
		return errors.New("not your nomination") // TODO
	}
	return s.Repository.Nomination().Delete(ctx, voterID)
}
