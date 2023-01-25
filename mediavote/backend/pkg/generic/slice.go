package generic

func Map[T, U any](ts []T, fn func(t T) U) []U {
	us := make([]U, 0, len(ts))
	for _, t := range ts {
		us = append(us, fn(t))
	}
	return us
}
