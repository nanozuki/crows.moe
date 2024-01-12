package doctor

import (
	"log"
	"net/url"
	"strings"
)

func init() {
	Doctors = append(Doctors, &Twitter{})
}

type Twitter struct{}

func (t *Twitter) ShouldCure(obj *url.URL, str string) bool {
	return obj.Host == "twitter.com" || obj.Host == "x.com"
}

func (t *Twitter) Cure(obj *url.URL, str string) []Reply {
	path := strings.TrimPrefix(obj.Path, "/")
	parts := strings.Split(path, "/")
	log.Printf("twitter parts: %v", parts)
	if len(parts) != 3 || parts[1] != "status" {
		return nil
	}
	fxTwitter := "https://fxtwitter.com/"
	if obj.Host == "x.com" {
		fxTwitter = "https://fixupx.com/"
	}
	return []Reply{
		{
			Title: "FxTwitter",
			Url:   fxTwitter + path,
		},
		{
			Title: "VxTwitter",
			Url:   "https://vxtwitter.com/" + path,
		},
	}
}
