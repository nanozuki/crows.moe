package doctor

import (
	"io"
	"log"
	"net/http"
	"net/url"
	"regexp"
)

var Doctors []Doctor

type Doctor interface {
	ShouldCure(obj *url.URL, str string) bool
	Cure(obj *url.URL, str string) []Reply
}

type Reply struct {
	Title string
	Url   string
}

var redirectHrefReg = regexp.MustCompile(`href="(https://[^"<>]*)"`)

func getRedirectHref(str string) *url.URL {
	req, err := http.NewRequest("GET", str, nil)
	if err != nil {
		log.Printf("Error build query: %s", err)
		return nil
	}
	req.Header.Set("User-Agent", "curl/8.1.2")
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	res, err := client.Do(req)
	if err != nil {
		log.Printf("Error query url: %s", err)
		return nil
	}
	defer res.Body.Close()
	ress, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error read response: %s", err)
		return nil
	}
	log.Printf("get response: %s", ress)
	addresses := redirectHrefReg.FindStringSubmatch(string(ress))
	if len(addresses) == 0 {
		return nil
	}
	log.Printf("find address in response: %s", addresses[1])
	u, err := url.Parse(string(addresses[1]))
	if err != nil {
		log.Printf("response '%s' is not a valid url", addresses[1])
		return nil
	}
	return u
}

func cleanUrl(obj *url.URL, str string) []Reply {
	result := url.URL{
		Scheme: obj.Scheme,
		Host:   obj.Host,
		Path:   obj.Path,
	}
	return []Reply{
		{"Clean URL", result.String()},
	}
}
