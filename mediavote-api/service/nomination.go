package service

import (
	"context"

	"github.com/nanozuki/crows.moe/mediavote-api/store"
)

func AddNomination(ctx context.Context, deptName store.DepartmentName, workName string) (*store.Department, error) {
	dept, err := store.GetOrNewDepartment(ctx, deptName)
	if err != nil {
		return nil, err
	}
	dept.AddWork(workName)
	if err := store.SetDepartment(ctx, dept); err != nil {
		return nil, err
	}
	return dept, nil
}

func GetNominations(ctx context.Context, deptName store.DepartmentName) (*store.Department, error) {
	dept, err := store.GetOrNewDepartment(ctx, deptName)
	if err != nil {
		return nil, err
	}
	return dept, nil
}
