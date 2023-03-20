package entity

import (
	"context"
	"reflect"
	"testing"
)

func TestCtxUserFromContext(t *testing.T) {
	type args struct {
		ctx context.Context
	}
	tests := []struct {
		name string
		args args
		want *CtxUser
	}{
		{
			"normal",
			args{
				ctx: (&CtxUser{
					VoterID: 1,
					Name:    "nanozuki",
					IsAdmin: false,
				}).SetCtx(context.Background()),
			},
			&CtxUser{
				VoterID: 1,
				Name:    "nanozuki",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CtxUserFromContext(tt.args.ctx); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CtxUserFromContext() = %v, want %v", got, tt.want)
			}
		})
	}
}
