package terror

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Error struct {
	statusCode int
	code       string
	message    string
	origin     error
}

func New(statusCode int, code string, message string) *Error {
	return &Error{
		statusCode: statusCode,
		code:       code,
		message:    message,
	}
}

func IsErrCode(err error, code string) bool {
	ie := &Error{}
	if ok := errors.As(err, &ie); !ok {
		return false
	}
	return ie.code == code
}

func (e *Error) Error() string {
	if e.message == "" {
		return e.code
	}
	return fmt.Sprintf("%s: %s", e.code, e.message)
}

func (e *Error) Wrap(err error) error {
	if err == nil {
		return nil
	}
	e.origin = err
	return e
}

func (e *Error) Is(target error) bool {
	err, ok := target.(*Error)
	if !ok {
		return false
	}
	return e.statusCode == err.statusCode && e.code == err.code && e.message == err.message
}

func (e *Error) Unwrap() error {
	return e.origin
}

type ErrorResponse struct {
	Code    string `json:"code,omitempty"`
	Message string `json:"message,omitempty"`
	Origin  string `json:"origin,omitempty"`
}

func (e *Error) EchoError(c echo.Context) error {
	res := ErrorResponse{
		Code:    e.code,
		Message: e.message,
	}
	if e.origin != nil {
		res.Origin = e.origin.Error()
	}
	return c.JSON(e.statusCode, res)
}

func ErrorHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		err := next(c)
		switch e := err.(type) {
		case nil:
			return nil
		case *Error:
			return e.EchoError(c)
		case *echo.HTTPError:
			res := ErrorResponse{
				Code:    http.StatusText(e.Code),
				Message: fmt.Sprint(e.Message),
			}
			if e.Internal != nil {
				res.Origin = e.Internal.Error()
			}
			return c.JSON(e.Code, e)
		default:
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Code:    http.StatusText(http.StatusInternalServerError),
				Message: err.Error(),
			})
		}
	}
}
