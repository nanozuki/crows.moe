package api

import (
	"context"
	"net/http"
)

type MediaVoteService interface {
	// GetYears returns all years' information
	// GET: /mediavote/v1/years
	GetYears(ctx context.Context, req *GetYearsRequest) (*GetYearsResponse, error)
	// Get the specified year's information
	// GET: /mediavote/v1/years/{year}
	GetYear(ctx context.Context, req *GetYearRequest) (*GetYearResponse, error)
	// GetAwards in specified year and department
	// GET: /mediavote/v1/years/{year}/awards/{dept}
	GetAwards(ctx context.Context, req *GetAwardsRequest) (*GetAwardsResponse, error)
	// GetNominations in specified year and department
	// GET: /mediavote/v1/years/{year}/nominations/{dept}
	GetNominations(ctx context.Context, req *GetNominationsRequest) (*GetNominationsResponse, error)
	// PostNominations in specified year and department
	// POST: /mediavote/v1/years/{year}/nominations/{dept}
	PostNominations(ctx context.Context, req *PostNominationsRequest) (*PostNominationsResponse, error)
	// GetLoggedVoter returns the logged in user's information
	// GET: /mediavote/v1/years/{year}/voters/logged
	GetLoggedVoter(ctx context.Context, req *GetLoggedVoterRequest) (*GetLoggedVoterResponse, error)
	// SignUpVoter creates a new voter
	// POST: /mediavote/v1/years/{year}/voters
	SignUpVoter(ctx context.Context, req *SignUpVoterRequest) (*SignUpVoterResponse, error)
	// LogInVoter and returns a cookie
	// POST: /mediavote/v1/years/{year}/sessions
	LogInVoter(ctx context.Context, req *LogInVoterRequest) (*LogInVoterResponse, error)
	// GetBallot in specified year and department
	// GET: /mediavote/v1/years/{year}/ballots/{dept}
	GetBallot(ctx context.Context, req *GetBallotRequest) (*GetBallotResponse, error)
	// PutBallot in specified year and department from logged in user
	// PUT: /mediavote/v1/years/{year}/ballots/{dept}
	PutBallot(ctx context.Context, req *PutBallotRequest) (*PutBallotResponse, error)
}

type GetYearsRequest struct{}

type GetYearsResponse struct {
	Years []*Year `json:"years,omitempty"`
}

type GetYearRequest struct {
	Year int `path:"year"`
}

type GetYearResponse Year

type GetAwardsRequest struct {
	Year int    `path:"year"`
	Dept string `path:"dept"`
}

type GetAwardsResponse struct {
	Rankings []*AwardItem `json:"rankings,omitempty"`
}

type GetNominationsRequest struct {
	Year int    `path:"year"`
	Dept string `path:"dept"`
}

type GetNominationsResponse struct {
	Works []*Work `json:"nominations,omitempty"`
}

type PostNominationsRequest struct {
	Year int    `path:"year"`
	Dept string `path:"dept"`
	Work *Work  `json:"work,omitempty"`
}

type PostNominationsResponse struct {
	Works []*Work `json:"nominations,omitempty"`
}

type GetLoggedVoterRequest struct {
	Year int `path:"year"`
}

type GetLoggedVoterResponse struct {
	Name string `json:"name,omitempty"`
}

type SignUpVoterRequest struct {
	Year int    `path:"year"`
	Name string `json:"name,omitempty"`
}

type SignUpVoterResponse struct {
	Name   string       `json:"name,omitempty"`
	Cookie *http.Cookie `json:"-"`
}

func (r *SignUpVoterResponse) SetCookie() *http.Cookie {
	return r.Cookie
}

type LogInVoterRequest struct {
	Year int    `path:"year"`
	Name string `json:"name"`
	PIN  string `json:"pin"`
}

type LogInVoterResponse struct {
	Cookie *http.Cookie `json:"-"`
}

func (r *LogInVoterResponse) SetCookie() *http.Cookie {
	return r.Cookie
}

type GetBallotRequest struct {
	Year int    `path:"year"`
	Dept string `path:"dept"`
}

type GetBallotResponse struct {
	Rankings []RankingItem `json:"rankings,omitempty"`
}

type PutBallotRequest struct {
	Year     int           `path:"year"`
	Dept     string        `path:"dept"`
	Rankings []RankingItem `json:"rankings,omitempty"`
}

type PutBallotResponse struct {
	Rankings []RankingItem `json:"rankings,omitempty"`
}
