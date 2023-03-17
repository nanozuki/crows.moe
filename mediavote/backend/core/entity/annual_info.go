package entity

import (
	"time"
)

type AnnualInfo struct {
	Year               int       `json:"year,omitempty"`
	NominationsStartAt time.Time `json:"nominations_start_at,omitempty"`
	VoteStartAt        time.Time `json:"vote_start_at,omitempty"`
	AwardsStartAt      time.Time `json:"awards_start_at,omitempty"`
}

func (i AnnualInfo) Stage() Stage {
	now := time.Now()
	if now.After(i.AwardsStartAt) {
		return StageAwards
	}
	if now.After(i.VoteStartAt) {
		return StageVote
	}
	if now.After(i.NominationsStartAt) {
		return StageNominations
	}
	return StageNotYet
}

// GET  /years
// GET  /years/current

// stage nomination
// GET  /nominations/<dept>
// POST /nominations

// stage vote
// POST /voters
// POST /sessions
// PUT  /voters/ballot @auth
// GET  /voters/ballot @auth
// GET  /rankings

// stage awards
// GET  /awards/<year>
// GET  /ballots/<year>

// collection: years -> nominations
//                   -> works
//                   -> voters
//                   -> ballots
//                   -> rankings
