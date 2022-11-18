package val

type Department uint

const (
	_          Department = iota
	TVAnime               // 1
	NonTVAnime            // 2
	Manga                 // 3
	Game                  // 4
	Novel                 // 5
)

func AllDepartment() []Department {
	return []Department{TVAnime, NonTVAnime, Manga, Game, Novel}
}

func (d Department) String() string {
	switch d {
	case TVAnime:
		return "TVAnime"
	case NonTVAnime:
		return "NonTVAnime"
	case Manga:
		return "Manga"
	case Game:
		return "Game"
	case Novel:
		return "Novel"
	default:
		return "unknown"
	}
}

func (d Department) IsValid() bool {
	return d >= TVAnime && d <= Novel
}
