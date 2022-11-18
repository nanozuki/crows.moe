package entity

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type UUIDModel struct {
	ID        uuid.UUID `gorm:"primarykey;size:32"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
