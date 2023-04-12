package entity

type Work struct {
	Name       string   `firestore:"name,omitempty" json:"name,omitempty"`
	OriginName string   `firestore:"origin_name,omitempty" json:"origin_name,omitempty"`
	Alias      []string `firestore:"alias,omitempty" json:"alias,omitempty"`
}

type RankingItem struct {
	Ranking  int    `firestore:"ranking,omitempty" json:"ranking,omitempty"`
	WorkName string `firestore:"work_name,omitempty" json:"work_name,omitempty"`
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

type DepartmentName string

const (
	Anime         DepartmentName = "anime"
	MangaAndNovel DepartmentName = "manga-novel"
	Game          DepartmentName = "game"
)

var AllDepartment = []DepartmentName{
	Anime,
	MangaAndNovel,
	Game,
}

func (e DepartmentName) IsValid() bool {
	switch e {
	case Anime, MangaAndNovel, Game:
		return true
	}
	return false
}

func (e DepartmentName) String() string {
	return string(e)
}

type AwardItem struct {
	Ranking int   `firestore:"ranking,omitempty" json:"ranking,omitempty"`
	Work    *Work `firestore:"work,omitempty" json:"work,omitempty"`
}
