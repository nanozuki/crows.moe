package entity

import "time"

type AnnualInfo struct {
	ID                 uint      `json:"-"`
	Year               int       `json:"year,omitempty"`
	Stage              Stage     `json:"stage,omitempty"`
	NominationsStartAt time.Time `json:"-"`
	VoteStartAt        time.Time `json:"-"`
	AwardsStartAt      time.Time `json:"-"`
}
