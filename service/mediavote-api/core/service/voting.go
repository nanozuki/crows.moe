package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/core/store"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
)

func NewVoter(ctx context.Context, name string) (*entity.Voter, *entity.Session, error) {
	voter, err := entity.NewVoter(name)
	if err != nil {
		return nil, nil, err
	}
	session := entity.NewSession(voter.Name)
	if err := store.CreateVoterAndSession(ctx, voter, session); err != nil {
		return nil, nil, err
	}
	return voter, session, nil
}

func LoginVoter(ctx context.Context, name string, pinCode string) (*entity.Session, error) {
	if err := store.CheckVoter(ctx, name, pinCode); err != nil {
		return nil, err
	}
	session := entity.NewSession(name)
	if err := store.CreateSession(ctx, session); err != nil {
		return nil, err
	}
	return session, nil
}

func GetSession(ctx context.Context, sessionKey string) (*entity.Session, error) {
	return store.GetSession(ctx, sessionKey)
}

func VoterEditBallot(ctx context.Context, ballot *entity.Ballot) error {
	if !ballot.Dept.IsValid() {
		return terror.InvalidValue("dept")
	}
	dept, err := store.GetOrNewDepartment(ctx, ballot.Dept)
	if err != nil {
		return err
	}
	if err := ballot.Validator(dept); err != nil {
		return err
	}
	return store.SetVoterBallot(ctx, ballot)
}

func VoterGetBallot(ctx context.Context, voterName string, deptName entity.DepartmentName) (*entity.Ballot, error) {
	ballot, err := store.GetVoterBallot(ctx, voterName, deptName)
	if terror.IsErrCode(err, "NotFound") {
		return &entity.Ballot{Voter: voterName, Dept: deptName}, nil
	}
	if err != nil {
		return nil, err
	}
	return ballot, nil
}
