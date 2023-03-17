package gql_test

import (
	"context"
	"testing"
	"time"

	"github.com/nanozuki/crows.moe/mediavote/backend/core/entity"
	"github.com/nanozuki/crows.moe/mediavote/backend/core/port"
	"github.com/nanozuki/crows.moe/mediavote/backend/graph"
	"github.com/nanozuki/crows.moe/mediavote/backend/tools/inj"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Nominations(t *testing.T) {
	rsv, err := inj.InitGqlResolver()
	require.NoError(t, err, "InitGqlResolver")
	require.NoError(t, rsv.Repository.Reset(), "Repository.Reset()")
	mut := graph.ResolverRoot(rsv).Mutation()
	qry := graph.ResolverRoot(rsv).Query()

	testNoms := []*entity.Nomination{
		{
			ID:         1,
			Department: entity.DepartmentTVAnime,
			WorkName:   "A1",
		},
		{
			ID:         2,
			Department: entity.DepartmentTVAnime,
			WorkName:   "A2",
		},
		{
			ID:         3,
			Department: entity.DepartmentTVAnime,
			WorkName:   "B",
		},
		{
			ID:         4,
			Department: entity.DepartmentGame,
			WorkName:   "A",
		},
		{
			ID:         5,
			Department: entity.DepartmentGame,
			WorkName:   "B",
		},
		{
			ID:         6,
			Department: entity.DepartmentGame,
			WorkName:   "C",
		},
		{
			ID:         7,
			Department: entity.DepartmentNonTVAnime,
			WorkName:   "a",
		},
	}
	t.Run("normal add/get", func(t *testing.T) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(len(testNoms))*10*time.Second)
		defer cancel()
		want := map[entity.Department][]*entity.Nomination{}
		for _, tn := range testNoms {
			gotNoms, err := mut.PostNomination(ctx, tn.Department, tn.WorkName)
			require.NoError(t, err)
			want[tn.Department] = append(want[tn.Department], tn)
			assert.Equal(t, want[tn.Department], gotNoms)
		}
		for dept, noms := range want {
			gotNoms, err := qry.Nominations(ctx, &dept)
			require.NoError(t, err)
			assert.Equal(t, noms, gotNoms)
		}
		{
			gotNoms, err := qry.Nominations(ctx, nil)
			require.NoError(t, err)
			assert.Equal(t, testNoms, gotNoms)
		}
	})
	t.Run("bind to work", func(t *testing.T) {
		work := &entity.Work{
			Department: entity.DepartmentTVAnime,
			NameCN:     "WorkA",
			NameOrigin: "WorkA",
			Alias:      []string{"A1", "A2"},
		}
		wantNoms := []*entity.Nomination{
			{
				ID:         1,
				Department: entity.DepartmentTVAnime,
				WorkName:   "A1",
				WorkID:     &work.ID,
			},
			{
				ID:         2,
				Department: entity.DepartmentTVAnime,
				WorkName:   "A2",
				WorkID:     &work.ID,
			},
			{
				ID:         3,
				Department: entity.DepartmentTVAnime,
				WorkName:   "B",
			},
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		require.NoError(t, rsv.Repository.Work().Create(ctx, work))
		require.NoError(t, rsv.Repository.Nomination().UpdateMany(ctx,
			&port.NominationQuery{WorkNames: []string{"A1", "A2"}},
			&port.NominationUpdate{WorkID: 1}))
		work.ID = 1

		t.Run("check nom work_id", func(t *testing.T) {
			dept := entity.DepartmentTVAnime
			gotNoms, err := qry.Nominations(ctx, &dept)
			require.NoError(t, err)
			assert.Equal(t, wantNoms, gotNoms)
		})

		t.Run("check get nom's work", func(t *testing.T) {
			nr := graph.ResolverRoot(rsv).Nomination()
			gotWork, err := nr.Work(ctx, wantNoms[0])
			require.NoError(t, err)
			work.ID = 1
			assert.Equal(t, work, gotWork)
		})
	})
}

/*
func Test_mutationResolver_PostBallot(t *testing.T) {
	rsv, err := inj.InitGqlResolver()
	require.NoError(t, err, "InitGqlResolver")
	require.NoError(t, rsv.Repository.Reset(), "Repository.Reset()")
	mut := graph.ResolverRoot(rsv).Mutation()
	qry := graph.ResolverRoot(rsv).Query()

	type args struct {
		ctx   context.Context
		input entity.BallotInput
	}
	tests := []struct {
		name    string
		args    args
		want    *entity.Ballot
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := mut.PostBallot(tt.args.ctx, tt.args.input)
			if (err != nil) != tt.wantErr {
				t.Errorf("mutationResolver.PostBallot() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("mutationResolver.PostBallot() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_queryResolver_Voter(t *testing.T) {
	rsv, err := inj.InitGqlResolver()
	require.NoError(t, err, "InitGqlResolver")
	require.NoError(t, rsv.Repository.Reset(), "Repository.Reset()")
	mut := graph.ResolverRoot(rsv).Mutation()
	qry := graph.ResolverRoot(rsv).Query()
	type args struct {
		ctx context.Context
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *entity.Voter
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Voter(tt.args.ctx)
			if (err != nil) != tt.wantErr {
				t.Errorf("queryResolver.Voter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("queryResolver.Voter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_queryResolver_Works(t *testing.T) {
	rsv, err := inj.InitGqlResolver()
	require.NoError(t, err, "InitGqlResolver")
	require.NoError(t, rsv.Repository.Reset(), "Repository.Reset()")
	mut := graph.ResolverRoot(rsv).Mutation()
	qry := graph.ResolverRoot(rsv).Query()
	type args struct {
		ctx        context.Context
		department *entity.Department
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    []*entity.Work
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Works(tt.args.ctx, tt.args.department)
			if (err != nil) != tt.wantErr {
				t.Errorf("queryResolver.Works() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("queryResolver.Works() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_queryResolver_Ranking(t *testing.T) {
	type fields struct {
		Resolver *Resolver
	}
	type args struct {
		ctx        context.Context
		department entity.Department
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *entity.Ranking
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Ranking(tt.args.ctx, tt.args.department)
			if (err != nil) != tt.wantErr {
				t.Errorf("queryResolver.Ranking() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("queryResolver.Ranking() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_queryResolver_Rankings(t *testing.T) {
	type fields struct {
		Resolver *Resolver
	}
	type args struct {
		ctx context.Context
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    []*entity.Ranking
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Rankings(tt.args.ctx)
			if (err != nil) != tt.wantErr {
				t.Errorf("queryResolver.Rankings() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("queryResolver.Rankings() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_voterResolver_Ballot(t *testing.T) {
	type fields struct {
		Resolver *Resolver
	}
	type args struct {
		ctx        context.Context
		obj        *entity.Voter
		department entity.Department
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *entity.Ballot
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &voterResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Ballot(tt.args.ctx, tt.args.obj, tt.args.department)
			if (err != nil) != tt.wantErr {
				t.Errorf("voterResolver.Ballot() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("voterResolver.Ballot() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_voterResolver_Nominations(t *testing.T) {
	type fields struct {
		Resolver *Resolver
	}
	type args struct {
		ctx        context.Context
		obj        *entity.Voter
		department entity.Department
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    []*entity.Nomination
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &voterResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Nominations(tt.args.ctx, tt.args.obj, tt.args.department)
			if (err != nil) != tt.wantErr {
				t.Errorf("voterResolver.Nominations() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("voterResolver.Nominations() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_workRankingResolver_Work(t *testing.T) {
	type fields struct {
		Resolver *Resolver
	}
	type args struct {
		ctx context.Context
		obj *entity.WorkRanking
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *entity.Work
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &workRankingResolver{
				Resolver: tt.fields.Resolver,
			}
			got, err := r.Work(tt.args.ctx, tt.args.obj)
			if (err != nil) != tt.wantErr {
				t.Errorf("workRankingResolver.Work() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("workRankingResolver.Work() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestResolver_Mutation(t *testing.T) {
	type fields struct {
		Repository port.Repository
	}
	tests := []struct {
		name   string
		fields fields
		want   graph.MutationResolver
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Resolver{
				Repository: tt.fields.Repository,
			}
			if got := r.Mutation(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolver.Mutation() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestResolver_Nomination(t *testing.T) {
	type fields struct {
		Repository port.Repository
	}
	tests := []struct {
		name   string
		fields fields
		want   graph.NominationResolver
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Resolver{
				Repository: tt.fields.Repository,
			}
			if got := r.Nomination(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolver.Nomination() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestResolver_Query(t *testing.T) {
	type fields struct {
		Repository port.Repository
	}
	tests := []struct {
		name   string
		fields fields
		want   graph.QueryResolver
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Resolver{
				Repository: tt.fields.Repository,
			}
			if got := r.Query(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolver.Query() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestResolver_Voter(t *testing.T) {
	type fields struct {
		Repository port.Repository
	}
	tests := []struct {
		name   string
		fields fields
		want   graph.VoterResolver
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Resolver{
				Repository: tt.fields.Repository,
			}
			if got := r.Voter(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolver.Voter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestResolver_WorkRanking(t *testing.T) {
	type fields struct {
		Repository port.Repository
	}
	tests := []struct {
		name   string
		fields fields
		want   graph.WorkRankingResolver
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Resolver{
				Repository: tt.fields.Repository,
			}
			if got := r.WorkRanking(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolver.WorkRanking() = %v, want %v", got, tt.want)
			}
		})
	}
}
*/
