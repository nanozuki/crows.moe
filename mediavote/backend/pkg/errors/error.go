package errors

import (
	"fmt"
	"strings"

	"github.com/google/go-cmp/cmp"
)

type Error struct {
	Code    string
	Fields  map[string]string
	Message string
}

func (e *Error) Error() string {
	if e.Message == "" && len(e.Fields) == 0 {
		return e.Code
	}
	if e.Message != "" {
		return fmt.Sprintf("%s: %s", e.Code, e.Message)
	}
	var ss []string
	for k, v := range e.Fields {
		ss = append(ss, fmt.Sprintf("%s=%s", k, v))
	}
	return fmt.Sprintf("%s: %s", e.Code, strings.Join(ss, " "))
}

func Is(err error, target *Error) bool {
	e, ok := err.(*Error)
	if !ok {
		return false
	}
	return e.Code == target.Code && cmp.Equal(e.Fields, target.Fields)
}
