package store

import (
	"context"
	"sort"
	"sync"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/mediavote-api/core/entity"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	currentYear     *entity.Year
	updatedAt       string
	timeToUpdatedAt = func(t time.Time) string {
		return t.Format("2006010215") // to hour string
	}
	yearLock = sync.Mutex{}
)

func yearRef(ctx context.Context) *firestore.DocumentRef {
	current, err := GetCurrentYear(ctx)
	if err != nil {
		log.Fatal().Msg("Can't get info of current year")
	}
	return client.Collection(colYear).Doc(current.ID())
}

func GetYears(ctx context.Context) ([]*entity.Year, error) {
	iter := client.Collection(colYear).Documents(ctx)
	years, err := readDocs[entity.Year](iter)
	if err != nil {
		return nil, err
	}
	// bigger first
	sort.Slice(years, func(i, j int) bool {
		return years[i].Year > years[j].Year
	})
	currentYear, updatedAt = years[len(years)-1], timeToUpdatedAt(time.Now())
	return years, nil
}

func GetCurrentYear(ctx context.Context) (*entity.Year, error) {
	yearLock.Lock()
	defer yearLock.Unlock()
	if currentYear != nil && timeToUpdatedAt(time.Now()) == updatedAt {
		return currentYear, nil
	}
	_, err := GetYears(ctx)
	if err != nil {
		return nil, err
	}
	return currentYear, nil
}

func GetOrNewDepartment(ctx context.Context, deptName entity.DepartmentName) (*entity.Department, error) {
	docRef := yearRef(ctx).Collection(colDepartment).Doc(deptName.String())
	doc, err := docRef.Get(ctx)
	if status.Code(err) == codes.NotFound {
		return &entity.Department{Dept: deptName}, nil
	}
	if err != nil {
		return nil, terror.FirestoreError("find department").Wrap(err)
	}
	return readDoc[entity.Department](doc), nil
}

func SetDepartment(ctx context.Context, dept *entity.Department) error {
	docRef := yearRef(ctx).Collection(colDepartment).Doc(dept.ID())
	_, err := docRef.Set(ctx, dept)
	return terror.FirestoreError("set department").Wrap(err)
}

func CreateVoterAndSession(ctx context.Context, voter *entity.Voter, session *entity.Session) error {
	voterRef := yearRef(ctx).Collection(colVoter).Doc(voter.ID())
	sessionRef := yearRef(ctx).Collection(colSession).Doc(session.ID())
	return client.RunTransaction(ctx, func(ctx context.Context, t *firestore.Transaction) error {
		_, err := voterRef.Get(ctx)
		switch {
		case err == nil:
			return terror.Duplicated("voter")
		case status.Code(err) != codes.NotFound:
			return terror.FirestoreError("get voter").Wrap(err)
		default: // case status.Code(err) == codes.NotFound
		}
		log.Info().Msgf("create voter and session, voter = %+v, session = %+v", voter, session)
		if _, err := voterRef.Set(ctx, voter); err != nil {
			return terror.FirestoreError("insert voter").Wrap(err)
		}
		if _, err := sessionRef.Set(ctx, session); err != nil {
			return terror.FirestoreError("insert voter").Wrap(err)
		}
		return nil
	})
}

func CheckVoter(ctx context.Context, name string, pinCode string) error {
	log.Info().Msgf("check voter, name = %s, pinCode = %s", name, pinCode)
	ref := yearRef(ctx).Collection(colVoter).Doc(name)
	doc, err := ref.Get(ctx)
	if err != nil {
		return terror.FirestoreError("get voter").Wrap(err)
	}
	if status.Code(err) == codes.NotFound {
		return terror.NotFound("voter")
	}
	voter := readDoc[entity.Voter](doc)
	if voter.PinCode != pinCode {
		return terror.InvalidPinCode()
	}
	return nil
}

func CreateSession(ctx context.Context, session *entity.Session) error {
	_, err := yearRef(ctx).Collection(colSession).Doc(session.ID()).Set(ctx, session)
	return terror.FirestoreError("insert voter").Wrap(err)
}

func GetSession(ctx context.Context, key string) (*entity.Session, error) {
	year, err := GetCurrentYear(ctx)
	if err != nil {
		return nil, err
	}
	doc, err := client.Collection(colYear).Doc(year.ID()).Collection(colSession).Doc(key).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, terror.InvalidToken()
	}
	if err != nil {
		return nil, terror.FirestoreError("get session").Wrap(err)
	}
	session := readDoc[entity.Session](doc)
	return session, nil
}

func GetVoterBallot(ctx context.Context, voterName string, deptName entity.DepartmentName) (*entity.Ballot, error) {
	id := (&entity.Ballot{Voter: voterName, Dept: deptName}).ID()
	doc, err := yearRef(ctx).Collection(colBallot).Doc(id).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, terror.NotFound("ballot")
	}
	if err != nil {
		return nil, terror.FirestoreError("find voter's ballot")
	}
	return readDoc[entity.Ballot](doc), nil
}

func SetVoterBallot(ctx context.Context, ballot *entity.Ballot) error {
	_, err := yearRef(ctx).Collection(colBallot).Doc(ballot.ID()).Set(ctx, ballot)
	return terror.FirestoreError("find voter's ballot").Wrap(err)
}

func GetBallotsByYear(ctx context.Context, year int) ([]*entity.Ballot, error) {
	id := (&entity.Year{Year: year}).ID()
	iter := client.Collection(colYear).Doc(id).Collection(colBallot).Documents(ctx)
	ballots, err := readDocs[entity.Ballot](iter)
	if err != nil {
		return nil, err
	}
	return ballots, nil
}

func SetAwards(ctx context.Context, year int, awards []*entity.Award) error {
	id := (&entity.Year{Year: year}).ID()
	for _, award := range awards {
		ref := client.Collection(colYear).Doc(id).Collection(colAward).Doc(award.ID())
		if _, err := ref.Set(ctx, award); err != nil {
			return terror.FirestoreError("set awards").Wrap(err)
		}
	}
	return nil
}

func GetAwardsByYear(ctx context.Context, year int) ([]*entity.Award, error) {
	id := (&entity.Year{Year: year}).ID()
	iter := client.Collection(colYear).Doc(id).Collection(colAward).Documents(ctx)
	awards, err := readDocs[entity.Award](iter)
	if err != nil {
		return nil, err
	}
	return awards, nil
}
