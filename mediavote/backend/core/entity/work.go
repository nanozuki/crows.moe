package entity

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/core/val"
	"gorm.io/gorm"
)

type Work struct {
	gorm.Model
	Department val.Department
	NameCN     string `gorm:"type:varchar(255)"`
	NameOrigin string `gorm:"type:varchar(255)"`
}
