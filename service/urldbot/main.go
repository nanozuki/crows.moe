package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

var (
	token       = os.Getenv("URLDBOT_TOKEN")
	webhookHost = os.Getenv("URLDBOT_WEBHOOK_HOST")
)

func main() {
	if token == "" || webhookHost == "" {
		log.Fatal("URLDBOT_TOKEN or URLDBOT_WEBHOOK_HOST is empty")
	}
	bot, err := tg.NewBotAPI(token)
	if err != nil {
		log.Panic(err)
	}
	bot.Debug = true

	wh, err := tg.NewWebhook(fmt.Sprintf("https://%s/%s", webhookHost, bot.Token))
	if err != nil {
		log.Panic(err)
	}
	_, err = bot.Request(wh)
	if err != nil {
		log.Fatal(err)
	}
	wh.AllowedUpdates = []string{"inline_query"}

	info, err := bot.GetWebhookInfo()
	if err != nil {
		log.Fatal(err)
	}
	if info.LastErrorDate != 0 {
		log.Printf("Telegram callback failed: %s", info.LastErrorMessage)
	}

	updates := bot.ListenForWebhook("/" + bot.Token)
	go func() {
		if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatal(err)
		}
	}()

	for update := range updates {
		if update.InlineQuery != nil {
			go handleInlineQuery(bot, update.InlineQuery)
		}
	}
}

type Reply struct {
	Title string
	Url   string
}

func makeResponse(queryId string, replies []Reply) tg.InlineConfig {
	response := tg.InlineConfig{
		InlineQueryID: queryId,
		Results:       []interface{}{},
		CacheTime:     86400,
		IsPersonal:    false,
	}
	for i, reply := range replies {
		article := tg.NewInlineQueryResultArticle(fmt.Sprint(i), reply.Title, reply.Url)
		article.Description = reply.Url
		response.Results = append(response.Results, article)
	}
	return response
}

type CureFunc func(*url.URL, string) []Reply

var (
	httpReg = regexp.MustCompile(`(https?://)?\w+(\.\w+)+(/\S*)?`)
	cures   = map[string]CureFunc{
		"b23.tv":         cureBilibili,
		"twitter.com":    cureTwitter,
		"x.com":          cureTwitter,
		"youtu.be":       cureYoutube,
		"www.reddit.com": cureReddit,
		"xhslink.com":    cureXiaohongshu,
	}
)

func handleInlineQuery(bot *tg.BotAPI, query *tg.InlineQuery) {
	fmt.Printf("[%s] %s\n", query.From.UserName, query.Query)
	urlInQuery := httpReg.FindString(query.Query)
	if urlInQuery == "" {
		log.Printf("not url query: %s", query.Query)
		return
	}
	u, err := url.Parse(urlInQuery)
	if err != nil {
		log.Printf("not url query: %s", urlInQuery)
		return
	}
	fmt.Println("query host is: ", u.Host)
	cure, ok := cures[u.Host]
	if !ok {
		return
	}
	response := makeResponse(query.ID, cure(u, urlInQuery))
	fmt.Println("bot response: ", response)
	if len(response.Results) == 0 {
		log.Printf("No response for query: %s", urlInQuery)
		return
	}
	_, err = bot.Send(response)
	if err != nil {
		log.Printf("Error sending inline query response: %s", err)
	}
}

var redirectHrefReg = regexp.MustCompile(`href="(https://[^"<>]*)"`)

func getRedirectHref(urlStr string) *url.URL {
	req, err := http.NewRequest("GET", urlStr, nil)
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

func cureBilibili(urlObj *url.URL, source string) []Reply {
	u := getRedirectHref(source)
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

func cureTwitter(urlObj *url.URL, source string) []Reply {
	path := strings.TrimPrefix(urlObj.Path, "/")
	parts := strings.Split(path, "/")
	log.Printf("twitter parts: %v", parts)
	if len(parts) != 3 || parts[1] != "status" {
		return nil
	}
	fxTwitter := "https://fxtwitter.com/"
	if urlObj.Host == "x.com" {
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

func cureYoutube(urlObj *url.URL, urlStr string) []Reply {
	query := url.Values{}
	query.Set("v", strings.TrimPrefix(urlObj.Path, "/"))
	if urlObj.Query().Get("t") != "" {
		query.Set("t", urlObj.Query().Get("t"))
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

func cureReddit(urlObj *url.URL, urlStr string) []Reply {
	if !strings.Contains(urlObj.Path, "/s/") {
		// not share url, just clean query
		target := url.URL{
			Scheme: "https",
			Host:   "www.reddit.com",
			Path:   urlObj.Path,
		}
		oldTarget := url.URL{
			Scheme: "https",
			Host:   "old.reddit.com",
			Path:   urlObj.Path,
		}
		return []Reply{
			{Title: "Reddit", Url: target.String()},
			{Title: "OldReddit", Url: oldTarget.String()},
		}
	}
	u := getRedirectHref(urlStr)
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

func cureXiaohongshu(urlObj *url.URL, urlStr string) []Reply {
	u := getRedirectHref(urlStr)
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
