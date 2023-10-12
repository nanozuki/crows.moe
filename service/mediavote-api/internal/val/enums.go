package val

type DepartmentName string

const (
	Anime         DepartmentName = "anime"
	MangaAndNovel DepartmentName = "manga-novel"
	Game          DepartmentName = "game"
	// legacy category
	TVAnime    DepartmentName = "TVAnime"
	NonTVAnime DepartmentName = "NonTVAnime"
	Manga      DepartmentName = "Manga"
	Novel      DepartmentName = "Novel"
)

func (e DepartmentName) String() string {
	return string(e)
}
