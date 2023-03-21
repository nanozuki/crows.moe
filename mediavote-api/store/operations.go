package store

import (
	"context"
	"sort"
	"sync"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	currentYear     *Year
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
	return client.Collection(ColYear).Doc(current.ID())
}

func GetYears(ctx context.Context) ([]*Year, error) {
	iter := client.Collection(ColYear).Documents(ctx)
	years, err := readDocs[Year](iter)
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

func GetCurrentYear(ctx context.Context) (*Year, error) {
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

func GetOrNewDepartment(ctx context.Context, deptName DepartmentName) (*Department, error) {
	docRef := yearRef(ctx).Collection(ColDepartment).Doc(deptName.String())
	doc, err := docRef.Get(ctx)
	if status.Code(err) == codes.NotFound {
		return &Department{Dept: deptName}, nil
	}
	if err != nil {
		return nil, terror.FirestoreError("find department").Wrap(err)
	}
	return readDoc[Department](doc), nil
}

func SetDepartment(ctx context.Context, dept *Department) error {
	docRef := yearRef(ctx).Collection(ColDepartment).Doc(dept.ID())
	_, err := docRef.Set(ctx, dept)
	return terror.FirestoreError("set department").Wrap(err)
}

func CreateVoterAndSession(ctx context.Context, voter *Voter, session *Session) error {
	ref := yearRef(ctx).Collection(ColVoter).Doc(voter.ID())
	return client.RunTransaction(ctx, func(ctx context.Context, t *firestore.Transaction) error {
		_, err := ref.Get(ctx)
		switch {
		case err == nil:
			return terror.Duplicated("voter")
		case status.Code(err) != codes.NotFound:
			return terror.FirestoreError("get voter").Wrap(err)
		default: // case status.Code(err) == codes.NotFound
		}
		if _, err := ref.Set(ctx, voter); err != nil {
			return terror.FirestoreError("insert voter").Wrap(err)
		}
		if _, err := yearRef(ctx).Collection(ColSession).Doc(session.ID()).Set(ctx, session); err != nil {
			return terror.FirestoreError("insert voter").Wrap(err)
		}
		return nil
	})
}

func CheckVoter(ctx context.Context, name string, pinCode string) error {
	ref := yearRef(ctx).Collection(ColVoter).Doc(name)
	doc, err := ref.Get(ctx)
	if err != nil {
		return terror.FirestoreError("get voter").Wrap(err)
	}
	if status.Code(err) == codes.NotFound {
		return terror.NotFound("voter")
	}
	voter := readDoc[Voter](doc)
	if voter.PinCode != pinCode {
		return terror.InvalidPinCode()
	}
	return nil
}

func CreateSession(ctx context.Context, session *Session) error {
	_, err := yearRef(ctx).Collection(ColSession).Doc(session.ID()).Set(ctx, session)
	return terror.FirestoreError("insert voter").Wrap(err)
}

func GetSession(ctx context.Context, key string) (*Session, error) {
	year, err := GetCurrentYear(ctx)
	if err != nil {
		return nil, err
	}
	doc, err := client.Collection(ColYear).Doc(year.ID()).Collection(ColSession).Doc(key).Get(ctx)
	if err != nil {
		return nil, terror.FirestoreError("get session").Wrap(err)
	}
	if status.Code(err) == codes.NotFound {
		return nil, terror.InvalidToken()
	}
	session := readDoc[Session](doc)
	return session, nil
}

func GetVoterBallot(ctx context.Context, voterName string, deptName DepartmentName) (*Ballot, error) {
	id := (&Ballot{Voter: voterName, Dept: deptName}).ID()
	doc, err := yearRef(ctx).Collection(ColBallot).Doc(id).Get(ctx)
	if err != nil {
		return nil, terror.FirestoreError("find voter's ballot")
	}
	return readDoc[Ballot](doc), nil
}

func SetVoterBallot(ctx context.Context, ballot *Ballot) error {
	_, err := yearRef(ctx).Collection(ColBallot).Doc(ballot.ID()).Set(ctx, ballot)
	return terror.FirestoreError("find voter's ballot").Wrap(err)
}

func GetBallotsByYear(ctx context.Context, year int) ([]*Ballot, error) {
	id := (&Year{Year: year}).ID()
	iter := client.Collection(ColYear).Doc(id).Collection(ColBallot).Documents(ctx)
	ballots, err := readDocs[Ballot](iter)
	if err != nil {
		return nil, err
	}
	return ballots, nil
}

func GetAwardsByYear(ctx context.Context, year int) ([]*Awards, error) {
	id := (&Year{Year: year}).ID()
	iter := client.Collection(ColYear).Doc(id).Collection(ColAwards).Documents(ctx)
	awards, err := readDocs[Awards](iter)
	if err != nil {
		return nil, err
	}
	return awards, nil
}
