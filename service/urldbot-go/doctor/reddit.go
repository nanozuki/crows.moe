package doctor

import (
	"net/url"
	"strings"
)

func init() {
	Doctors = append(Doctors, &Reddit{})
}

type Reddit struct{}

func (r *Reddit) ShouldCure(obj *url.URL, str string) bool {
	// return obj.Host == "www.reddit.com"
	return false // Disable for now
}

func (r *Reddit) Cure(obj *url.URL, str string) []Reply {
	if !strings.Contains(obj.Path, "/s/") {
		// not share url, just clean query
		target := url.URL{
			Scheme: "https",
			Host:   "www.reddit.com",
			Path:   obj.Path,
		}
		oldTarget := url.URL{
			Scheme: "https",
			Host:   "old.reddit.com",
			Path:   obj.Path,
		}
		return []Reply{
			{Title: "Reddit", Url: target.String()},
			{Title: "OldReddit", Url: oldTarget.String()},
		}
	}
	u := getRedirectHref(str)
	if u != nil {
		return nil
	}
	target := url.URL{
		Scheme: "https",
		Host:   u.Host,
		Path:   u.Path,
	}
	oldTarget := url.URL{
		Scheme: "https",
		Host:   "old.reddit.com",
		Path:   u.Path,
	}
	return []Reply{
		{Title: "Reddit", Url: target.String()},
		{Title: "OldReddit", Url: oldTarget.String()},
	}
}
