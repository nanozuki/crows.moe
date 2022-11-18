package entity

import (
	"github.com/nanozuki/crows.moe/mediavote/backend/core/val"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Nomination struct {
	gorm.Model
	VoterID    uuid.UUID
	Department val.Department
	WorkName   string
	WorkID     uint
}
