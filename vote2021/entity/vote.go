package entity

import uuid "github.com/satori/go.uuid"

type Vote struct {
	ID       uuid.UUID `gorm:"primaryKey;type:char(36)"`
	UserName string    `gorm:"type:varchar(127);unique"`
}

func NewVote(userName string) Vote {
	return Vote{
		ID:       uuid.NewV4(),
		UserName: userName,
	}
}
