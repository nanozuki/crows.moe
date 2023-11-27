package service

import (
	"context"

	"github.com/nanozuki/crows.moe/cmd/ema-import/core/entity"
	"github.com/nanozuki/crows.moe/cmd/ema-import/core/store"
)

func AddNomination(ctx context.Context, deptName entity.DepartmentName, workName string) (*entity.Department, error) {
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

func GetNominations(ctx context.Context, deptName entity.DepartmentName) (*entity.Department, error) {
	dept, err := store.GetOrNewDepartment(ctx, deptName)
	if err != nil {
		return nil, err
	}
	return dept, nil
}
