package errors

import "fmt"

const (
	CodeForamtError         = "FormatError"
	CodeRequiredMissedError = "RequiredFieldMissed"
	CodeNoAuthError         = "NoAuth"
	CodeForbidden           = "Forbidden"
)

func FormatError(object string, value any) *Error {
	return &Error{
		Code:    CodeForamtError,
		Fields:  map[string]string{"object": object, "value": fmt.Sprint(value)},
		Message: fmt.Sprintf("invalid %s: '%s'", object, fmt.Sprint(value)),
	}
}

func RequiredMissedError(field string) *Error {
	return &Error{
		Code:    CodeRequiredMissedError,
		Fields:  map[string]string{"field": field},
		Message: fmt.Sprintf("%s is empty", field),
	}
}

func NoAuthError() *Error {
	return &Error{Code: CodeNoAuthError}
}

type Reason string

const (
	NotYourData Reason = "not your data"
	NotAdmin    Reason = "you are not admin"
)

func Forbidden(reason Reason) *Error {
	return &Error{
		Code:    CodeForbidden,
		Fields:  map[string]string{"reason": string(reason)},
		Message: string(reason),
	}
}
