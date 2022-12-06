package entity

type Nomination struct {
	ID         uint       `json:"id"`
	VoterID    uint       `json:"voterID"`
	Department Department `json:"department"`
	WorkName   string     `json:"workName"`
	WorkID     *uint      `json:"workID"`
}
