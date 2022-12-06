package entity

type Work struct {
	ID         uint       `json:"id"`
	Department Department `json:"department"`
	NameCn     string     `json:"nameCN"`
	NameOrigin string     `json:"nameOrigin"`
	Alias      []string   `json:"alias"`
}
