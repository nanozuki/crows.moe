package entity

import "time"

type Work struct {
	ID         uint `gorm:"primaryKey"`
	CreatedAt  time.Time
	Department Department
	Name       string `gorm:"type:varchar(127)"`
}
