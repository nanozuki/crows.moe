package util

import "log"

func Must[T any](result T, err error) T {
	if err != nil {
		log.Fatal(err)
	}
	return result
}
