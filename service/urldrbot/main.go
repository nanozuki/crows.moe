package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {
	bot, err := tg.NewBotAPI(os.Getenv("TELEGRAM_BOT_TOKEN"))
	if err != nil {
		log.Panic(err)
	}
	bot.Debug = true

	// wh, err := tg.NewWebhook("https://urldrbot.crows.moe/" + bot.Token)
	wh, err := tg.NewWebhook("https://pretty-polite-starfish.ngrok-free.app" + "/" + bot.Token)
	if err != nil {
		log.Panic(err)
	}
	_, err = bot.Request(wh)
	if err != nil {
		log.Fatal(err)
	}
	// wh.AllowedUpdates = []string{"inline_query"}

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
		CacheTime:     0,
		IsPersonal:    false,
	}
	for i, reply := range replies {
		response.Results = append(response.Results, tg.NewInlineQueryResultArticle(
			fmt.Sprint(i),
			reply.Title,
			reply.Url,
		))
	}
	return response
}

func handleInlineQuery(bot *tg.BotAPI, query *tg.InlineQuery) {
	fmt.Printf("[%s] %s\n", query.From.UserName, query.Query)
	u, err := url.Parse(query.Query)
	if err != nil {
		if _, err := bot.Send(tg.NewMessage(query.From.ID, "Invalid URL")); err != nil {
			log.Printf("not url query: %s", query.Query)
		}
	}
	response := makeResponse(query.ID, nil)
	fmt.Println("query host is: ", u.Host)
	if u.Host == "b23.tv" {
		response = makeResponse(query.ID, cureBilibili(query.Query))
		fmt.Println("bot response: ", response)
	}

	_, err = bot.Send(response)
	if err != nil {
		log.Printf("Error sending inline query response: %s", err)
	}
}

var b23Reg = regexp.MustCompile(`href="(https://www\.bilibili[^"]*)"`)

func cureBilibili(source string) []Reply {
	req, _ := http.NewRequest("GET", source, nil)
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
	address := b23Reg.Find(ress)
	log.Printf("fetch bilibili address: %s", address)
	if len(address) == 0 {
		return nil
	}
	u, err := url.Parse(string(address))
	if err != nil {
		return nil
	}
	target := url.URL{
		Scheme: "https",
		User:   &url.Userinfo{},
		Host:   u.Host,
		Path:   u.Path,
	}
	return []Reply{
		{Title: "Bilibili", Url: target.String()},
	}
}
