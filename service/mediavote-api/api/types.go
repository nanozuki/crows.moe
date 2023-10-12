package api

type Year struct {
	Year              int      `json:"year,omitempty"`
	Depts             []string `json:"depts,omitempty"`
	NominationStartAt int64    `json:"nomination_start_at,omitempty"`
	VotingStartAt     int64    `json:"voting_start_at,omitempty"`
	AwardStartAt      int64    `json:"award_start_at,omitempty"`
}

type AwardItem struct {
	Ranking    int    `json:"ranking,omitempty"`
	Name       string `json:"name,omitempty"`
	OriginName string `json:"origin_name,omitempty"`
}

type RankingItem struct {
	Ranking  int    `json:"ranking,omitempty"`
	WorkName string `json:"work_name,omitempty"`
}

type Work struct {
	Name       string   `json:"name,omitempty"`
	OriginName string   `json:"origin_name,omitempty"`
	Alias      []string `json:"alias,omitempty"`
}
