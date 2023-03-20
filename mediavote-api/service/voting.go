package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/store"
)

func NewVoter(ctx context.Context, name string) (*store.Session, error) {
	voter, err := store.NewVoter(name)
	if err != nil {
		return nil, err
	}
	session := store.NewSession(voter.Name)
	if err := store.CreateVoterAndSession(ctx, voter, session); err != nil {
		return nil, err
	}
	return session, nil
}

func LoginVoter(ctx context.Context, name string, pinCode string) (*store.Session, error) {
	if err := store.CheckVoter(ctx, name, pinCode); err != nil {
		return nil, err
	}
	session := store.NewSession(name)
	if err := store.CreateSession(ctx, session); err != nil {
		return nil, err
	}
	return session, nil
}

func GetSession(ctx context.Context, sessionKey string) (*store.Session, error) {
	return store.GetSession(ctx, sessionKey)
}

func VoterEditBallot(ctx context.Context, ballot *store.Ballot) error {
	dept, err := store.GetOrNewDepartment(ctx, ballot.Dept)
	if err != nil {
		return err
	}
	if err := ballot.Validator(dept); err != nil {
		return err
	}
	return store.SetVoterBallot(ctx, ballot)
	// TODO: calculate awards
}

func VoterGetBallot(ctx context.Context, voterName string, deptName store.DepartmentName) (*store.Ballot, error) {
	return store.GetVoterBallot(ctx, voterName, deptName)
}
