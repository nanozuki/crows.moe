package entity

type Ranking struct {
	Department Department     `json:"department"`
	Rankings   []*WorkRanking `json:"rankings"`
}
