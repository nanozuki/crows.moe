package doctor

import (
	"net/url"
	"strings"
)

func init() {
	Doctors = append(Doctors, &YoutuDotBe{})
}

type YoutuDotBe struct{}

func (y *YoutuDotBe) ShouldCure(obj *url.URL, str string) bool {
	return obj.Host == "youtu.be"
}

func (y *YoutuDotBe) Cure(obj *url.URL, str string) []Reply {
	query := url.Values{}
	query.Set("v", strings.TrimPrefix(obj.Path, "/"))
	if obj.Query().Get("t") != "" {
		query.Set("t", obj.Query().Get("t"))
	}
	target := url.URL{
		Scheme:   "https",
		Host:     "youtube.com",
		Path:     "/watch",
		RawQuery: query.Encode(),
	}
	return []Reply{
		{
			Title: "Youtube",
			Url:   target.String(),
		},
	}
}
