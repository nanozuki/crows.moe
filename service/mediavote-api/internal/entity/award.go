package entity

import "github.com/nanozuki/crows.moe/mediavote-api/internal/val"

type Award struct {
	Dept     val.DepartmentName `firestore:"dept,omitempty" json:"dept,omitempty"`
	Rankings []AwardItem        `firestore:"rankings,omitempty" json:"rankings,omitempty"`
}

type AwardItem struct {
	Ranking int       `firestore:"ranking,omitempty" json:"ranking,omitempty"`
	Work    *val.Work `firestore:"work,omitempty" json:"work,omitempty"`
}
