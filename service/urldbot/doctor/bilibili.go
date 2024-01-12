package doctor

import (
	"net/url"
	"strings"
)

func init() {
	Doctors = append(Doctors, B23{}, Bilibili{})
}

type B23 struct{}

func (b B23) ShouldCure(obj *url.URL, str string) bool {
	return obj.Host == "b23.tv"
}

func (b B23) Cure(obj *url.URL, src string) []Reply {
	u := getRedirectHref(src)
	if u == nil {
		return nil
	}
	target := url.URL{
		Scheme: "https",
		Host:   u.Host,
		Path:   u.Path,
	}
	return []Reply{
		{Title: "Bilibili", Url: target.String()},
	}
}

type Bilibili struct{}

func (b Bilibili) ShouldCure(obj *url.URL, str string) bool {
	return strings.Contains(obj.Host, "bilibili.com")
}

func (b Bilibili) Cure(obj *url.URL, src string) []Reply {
	return cleanUrl(obj, src)
}
