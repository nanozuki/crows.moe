package entity

type Work struct {
	ID         uint       `json:"id"`
	Department Department `json:"department"`
	NameCN     string     `json:"nameCN"`
	NameOrigin string     `json:"nameOrigin"`
}
