package entity

import "time"

type Work struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	Partment  Partment
	Name      string `gorm:"type:varchar(127)"`
}
