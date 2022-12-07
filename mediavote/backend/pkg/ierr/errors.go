package ierr

import "fmt"

const (
	CodeForamtError         = "FormatError"
	CodeRequiredFieldMissed = "RequiredFieldMissed"
	CodeRequiredEnvMissed   = "RequiredEnvMissed"
	CodeNoAuth              = "NoAuth"
	CodeForbidden           = "Forbidden"
	CodeAlreadyLoggedIn     = "AlreadyLoggedIn"
	CodeNameOrPinError      = "NameOrPinError"
	CodeNotFound            = "NotFound"
)

func FormatError(object string, value any) *Error {
	return &Error{
		Code:    CodeForamtError,
		Fields:  map[string]string{"object": object, "value": fmt.Sprint(value)},
		Message: fmt.Sprintf("invalid %s: '%s'", object, fmt.Sprint(value)),
	}
}

func RequiredFieldMissed(field string) *Error {
	return &Error{
		Code:    CodeRequiredFieldMissed,
		Fields:  map[string]string{"field": field},
		Message: fmt.Sprintf("%s is empty", field),
	}
}

func RequiredEnvMissed(env string) *Error {
	return &Error{
		Code:    CodeRequiredFieldMissed,
		Fields:  map[string]string{"env": env},
		Message: fmt.Sprintf("env %s is empty", env),
	}
}

func NoAuth() *Error {
	return &Error{Code: CodeNoAuth}
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
func AlreadyLoggedIn(name string) *Error {
	return &Error{
		Code:    CodeForbidden,
		Fields:  map[string]string{"name": name},
		Message: fmt.Sprintf("already logged in as '%s'", name),
	}
}

func NameOrPinError(name, pin string) *Error {
	return &Error{
		Code:    CodeNameOrPinError,
		Fields:  map[string]string{"name": name, "pin": pin},
		Message: "name or pin is not correct",
	}
}

func NotFound(object string, query F) *Error {
	e := &Error{
		Code: CodeNotFound,
	}
	if len(query) == 0 {
		e.Message = fmt.Sprintf("%s not found", object)
	} else {
		e.Message = fmt.Sprintf("%s not found: %s", object, query)
	}
	e.Fields = query.Set("object", object)
	return e
}
