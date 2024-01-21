package val

import (
	"fmt"
	"github.com/goccy/go-yaml"
)

type Department string

const (
	DeptAnime         Department = "anime"
	DeptMangaAndNovel Department = "manga-novel"
	DeptGame          Department = "game"

	// legacy categories:

	DeptTVAnime    Department = "tv-anime"
	DeptNonTVAnime Department = "non-tv-anime"
	DeptManga      Department = "manga"
	DeptNovel      Department = "novel"
)

func (d *Department) UnmarshalYAML(data []byte) error {
	dept := Department(string(data))
	switch dept {
	case DeptAnime, DeptMangaAndNovel, DeptGame, DeptTVAnime, DeptNonTVAnime, DeptManga, DeptNovel:
		*d = dept
		return nil
	default:
		return fmt.Errorf("invalid department: %s", dept)
	}
}

func (d *Department) MarshalYAML() ([]byte, error) {
	return yaml.Marshal(string(*d))
}
