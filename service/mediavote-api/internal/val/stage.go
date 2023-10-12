package val

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
