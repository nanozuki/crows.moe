use axum::{routing::post, Json, Router};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::env;
use telegram_types::bot::inline_mode::{
    AnswerInlineQuery, InlineQuery, InlineQueryResult, InlineQueryResultArticle,
    InputMessageContent, InputTextMessageContent, ResultId,
};
use url::Url;
mod doctors;

#[derive(Serialize)]
struct SetWebhookRequest {
    url: String,
    allowed_updates: Vec<String>,
}

#[derive(Deserialize)]
struct TelegramResponse {
    ok: bool,
    message: Option<String>,
}

#[tokio::main]
async fn main() {
    // active bot webhook
    let token = env::var("URLDBOT_TOKEN").unwrap();
    let webhook_host = env::var("URLDBOT_WEBHOOK_HOST").unwrap();
    let req_url = format!("https://api.telegram.org/bot{}/{}", token, "setWebhook");
    let req_body = SetWebhookRequest {
        url: format!("https://{}/{}", webhook_host, token),
        allowed_updates: vec!["inline_query".to_string()],
    };
    let client = reqwest::Client::new();
    let res = client
        .post(req_url)
        .json(&req_body)
        .send()
        .await
        .unwrap()
        .json::<TelegramResponse>()
        .await
        .unwrap();
    if !res.ok {
        panic!(
            "set webhook failed: {}",
            res.message.unwrap_or("unknown".to_string())
        );
    }
    print!("set webhook ok");

    // start http server, listen for webhook
    let app = Router::new().route(&format!("/{}", token), post(handle_inline_query));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

static QUERY_URL_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"(https?://)?\w+(\.\w+)+(/\S*)?").unwrap());

#[derive(Serialize)]
struct Answer<'a> {
    method: String,
    #[serde(flatten)]
    anwser: AnswerInlineQuery<'a>,
}

async fn handle_inline_query(Json(query): Json<InlineQuery>) -> Json<Value> {
    let mat = match QUERY_URL_RE.find(&query.query) {
        Some(m) => m,
        None => return Json(Value::Null),
    };
    let query_url = Url::parse(mat.into()).unwrap();
    let replies = doctors::cure_url(query_url).await;
    if replies.len() == 0 {
        return Json(Value::Null);
    }
    let articles = replies.iter().map(|r| {
        InlineQueryResult::Article(InlineQueryResultArticle {
            id: ResultId(r.url.clone()),
            title: r.title.clone().into(),
            input_message_content: InputMessageContent::Text(InputTextMessageContent {
                message_text: r.url.clone().into(),
                parse_mode: None,
                disable_web_page_preview: None,
            }),
            reply_markup: None,
            url: None,
            hide_url: None,
            description: None,
            thumb_url: None,
            thumb_width: None,
            thumb_height: None,
        })
    });
    let anwser = Answer {
        method: "answerInlineQuery".to_string(),
        anwser: AnswerInlineQuery {
            inline_query_id: query.id,
            results: articles.collect(),
            cache_time: Some(86400),
            is_personal: None,
            next_offset: None,
            switch_pm_text: None,
            switch_pm_parameter: None,
        },
    };
    return Json(serde_json::to_value(anwser).unwrap());
}
