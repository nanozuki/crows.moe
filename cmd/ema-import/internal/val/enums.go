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

type Stage string

const (
	StagePreparation Stage = "Preparation"
	StageNomination  Stage = "Nomination"
	StageVoting      Stage = "Voting"
	StageAward       Stage = "Award"
)

var AllStage = []Stage{
	StagePreparation,
	StageNomination,
	StageVoting,
	StageAward,
}

func (e Stage) IsValid() bool {
	switch e {
	case StagePreparation, StageNomination, StageVoting, StageAward:
		return true
	}
	return false
}

func (e Stage) String() string {
	return string(e)
}
