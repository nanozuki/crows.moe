package doctor

import "net/url"

func init() {
	Doctors = append(Doctors, &XhsLink{})
}

type XhsLink struct{}

func (x *XhsLink) ShouldCure(obj *url.URL, str string) bool {
	return obj.Host == "xhslink.com"
}

func (x *XhsLink) Cure(obj *url.URL, str string) []Reply {
	u := getRedirectHref(str)
	if u == nil {
		return nil
	}
	target := url.URL{
		Scheme: "https",
		Host:   u.Host,
		Path:   u.Path,
	}
	return []Reply{
		{Title: "小红书", Url: target.String()},
	}
}
