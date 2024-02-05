use axum::{routing::post, Json, Router};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::env;
use telegram_types::bot::inline_mode::{
    AnswerInlineQuery, InlineQuery, InlineQueryResult, InlineQueryResultArticle,
    InputMessageContent, InputTextMessageContent, ResultId,
};

#[derive(Serialize)]
struct SetWebhookRequest {
    url: String,
    allowed_updates: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct TelegramResponse {
    ok: bool,
}

#[tokio::main]
async fn main() {
    // active bot webhook
    let token = env::var("URLDBOT_TOKEN").unwrap();
    let webhook_host = env::var("URLDBOT_WEBHOOK_HOST").unwrap();
    let req_url = format!("https://api.telegram.org/{}/{}", token, "setWebhook");
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
        panic!("set webhook failed");
    }
    print!("set webhook ok");

    // start http server, listen for webhook
    let app = Router::new().route(&format!("/{}", token), post(handle_inline_query));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

static QUERY_URL_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"(https?://)?\w+(\.\w+)+(/\S*)?").unwrap());

async fn handle_inline_query(Json(query): Json<InlineQuery>) -> Json<AnswerInlineQuery<'static>> {
    print!("receive inline query: {:?}", query);
    let mat = QUERY_URL_RE.find(&query.query).unwrap();
    let query_url = url::Url::parse(mat.into()).unwrap();
    let result_article = InlineQueryResult::Article(InlineQueryResultArticle {
        id: ResultId("1".into()),
        title: "Title".into(),
        input_message_content: InputMessageContent::Text(InputTextMessageContent {
            message_text: query_url.to_string().into(),
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
    });
    return Json(AnswerInlineQuery {
        inline_query_id: query.id,
        results: vec![result_article].into(),
        cache_time: None,
        is_personal: None,
        next_offset: None,
        switch_pm_text: None,
        switch_pm_parameter: None,
    });
}
