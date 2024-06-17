package main

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"

	tg "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/nanozuki/crows.moe/service/urldbot/doctor"
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

func makeResponse(queryId string, replies []doctor.Reply) tg.InlineConfig {
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
	var response tg.InlineConfig
	for _, d := range doctor.Doctors {
		if d.ShouldCure(u, urlInQuery) {
			response = makeResponse(query.ID, d.Cure(u, urlInQuery))
			break
		}
	}
	if response.InlineQueryID == "" {
		return // not found doctor
	}
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
