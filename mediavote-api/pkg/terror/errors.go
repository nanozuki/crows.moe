package terror

import (
	"fmt"
	"net/http"
)

// 400

func RequiredFieldMissed(field string) *Error {
	msg := fmt.Sprintf("'%s' is required", field)
	return New(http.StatusBadRequest, "RequiredFieldMissed", msg)
}

func Duplicated(object string) *Error {
	msg := fmt.Sprintf("this %s is already exist", object)
	return New(http.StatusBadRequest, "Duplicated", msg)
}

func InvalidValue(field string) *Error {
	msg := fmt.Sprintf("%s is invalid", field)
	return New(http.StatusBadRequest, "InvalidValue", msg)
}

func InvalidRequestBody() *Error {
	return New(http.StatusBadRequest, "InvalidRequestBody", "")
}

func NotInStage(stage string) *Error {
	msg := fmt.Sprintf("This operation available in stage: %s", stage)
	return New(http.StatusBadRequest, "NotInRightStage", msg)
}

func InvalidPinCode() *Error {
	return New(http.StatusBadRequest, "InvalidPin", "")
}

// 401

func NoAuth() *Error {
	return New(http.StatusUnauthorized, "NoAuth", "not register or login")
}

func InvalidToken() *Error {
	return New(http.StatusUnauthorized, "InvalidToken", "")
}

// 404

func NotFound(object string) *Error {
	msg := fmt.Sprintf("can't find %s", object)
	return New(http.StatusNotFound, "NotFound", msg)
}

// 500

func FirestoreError(op string) *Error {
	msg := fmt.Sprintf("%s failed", op)
	return New(http.StatusInternalServerError, "FirestoreError", msg)
}
