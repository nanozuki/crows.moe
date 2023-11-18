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
		response.Results = append(response.Results, tg.NewInlineQueryResultArticle(
			fmt.Sprint(i),
			fmt.Sprintf("%s\n%s", reply.Title, reply.Url),
			reply.Url,
		))
	}
	return response
}

var httpReg = regexp.MustCompile(`(https?://)?\w+(\.\w+)+(/\S*)?`)

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
	switch u.Host {
	case "b23.tv":
		response := makeResponse(query.ID, cureBilibili(urlInQuery))
		fmt.Println("bot response: ", response)
		if len(response.Results) == 0 {
			log.Printf("No response for query: %s", urlInQuery)
			return
		}
		_, err = bot.Send(response)
		if err != nil {
			log.Printf("Error sending inline query response: %s", err)
		}
	case "twitter.com", "x.com":
		response := makeResponse(query.ID, cureTwitter(urlInQuery))
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
}

var b23Reg = regexp.MustCompile(`href="(https://www\.bilibili[^"]*)"`)

func cureBilibili(source string) []Reply {
	req, err := http.NewRequest("GET", source, nil)
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
		log.Printf("Error query bilibili url: %s", err)
		return nil
	}
	defer res.Body.Close()
	ress, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error read bilibili response: %s", err)
		return nil
	}
	log.Printf("bilibili response: %s", ress)
	addresses := b23Reg.FindStringSubmatch(string(ress))
	if len(addresses) == 0 {
		return nil
	}
	log.Printf("fetch bilibili address: %s", addresses[1])
	u, err := url.Parse(string(addresses[1]))
	if err != nil {
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

func cureTwitter(source string) []Reply {
	u, _ := url.Parse(source)
	parts := strings.Split(strings.TrimPrefix(u.Path, "/"), "/")
	log.Printf("twitter parts: %v", parts)
	if len(parts) != 3 || parts[1] != "status" {
		return nil
	}
	return []Reply{
		{
			Title: "FxTwitter",
			Url:   "https://fxtwitter.com/" + u.Path,
		},
		{
			Title: "VxTwitter",
			Url:   "https://vxtwitter.com/" + u.Path,
		},
	}
}
