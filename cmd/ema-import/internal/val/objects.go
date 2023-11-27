package val

type Work struct {
	Name       string   `firestore:"name,omitempty" json:"name,omitempty"`
	OriginName string   `firestore:"origin_name,omitempty" json:"origin_name,omitempty"`
	Alias      []string `firestore:"alias,omitempty" json:"alias,omitempty"`
}
