package ierr

import (
	"errors"
	"fmt"
	"strings"

	"github.com/google/go-cmp/cmp"
)

type Error struct {
	Code    string
	Fields  F
	Message string
	Origin  error
}

func (e *Error) Error() string {
	if e.Message == "" && len(e.Fields) == 0 {
		return e.Code
	}
	if e.Message != "" {
		return fmt.Sprintf("%s: %s", e.Code, e.Message)
	}
	fs := e.Fields.String()
	if fs == "" {
		return e.Code
	}
	return fmt.Sprintf("%s: %s", e.Code, fs)
}

// From origin error
func (e *Error) From(err error) *Error {
	e.Origin = err
	return e
}

func Is(err error, target *Error) bool {
	e, ok := err.(*Error)
	if !ok {
		return false
	}
	return e.Code == target.Code && cmp.Equal(e.Fields, target.Fields)
}

func IsErrCode(err error, code string) bool {
	ie := &Error{}
	if ok := errors.As(err, &ie); !ok {
		return false
	}
	return ie.Code == code
}

type F map[string]string

func (f *F) Set(k, v string) F {
	if *f == nil {
		*f = F{}
	}
	(*f)[k] = v
	return *f
}

func (f F) String() string {
	var ss []string
	for k, v := range f {
		ss = append(ss, fmt.Sprintf("%s=%s", k, v))
	}
	return strings.Join(ss, " ")
}
