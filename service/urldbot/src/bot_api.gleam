import gleam/dynamic.{type DecodeError, type Dynamic}
import gleam/http
import gleam/http/request
import gleam/http/response.{type Response}
import gleam/httpc
import gleam/json
import gleam/result

import error.{type Ret}

pub type Bot {
  Bot(token: String, host: String)
}

type RequestBody {
  SetWebhook(url: String, allowed_updates: List(String))
}

fn request_body_to_json(body: RequestBody) -> String {
  case body {
    SetWebhook(url, allowed_updates) ->
      json.object([
        #("url", json.string(url)),
        #("allowed_updates", json.array(allowed_updates, of: json.string)),
      ])
      |> json.to_string
  }
}

pub fn response_body_decoder(
  dyn: Dynamic,
) -> Result(Ret(Nil), List(DecodeError)) {
  let ok_decoder = dynamic.field("ok", dynamic.bool)
  let err_decoder =
    dynamic.decode2(
      error.BotApiError,
      dynamic.field("error_code", dynamic.int),
      dynamic.field("description", dynamic.string),
    )
  case ok_decoder(dyn) {
    Ok(True) -> Ok(Ok(Nil))
    Ok(False) -> {
      case err_decoder(dyn) {
        Ok(err) -> Ok(Error(err))
        Error(err) -> Error(err)
      }
    }
    Error(err) -> Error(err)
  }
}

pub fn decode_response_body(res: Response(String)) -> Ret(Nil) {
  case json.decode(from: res.body, using: response_body_decoder) {
    Ok(Ok(Nil)) -> Ok(Nil)
    Ok(Error(err)) -> Error(err)
    Error(err) -> {
      Error(error.unexpected(err, "Failed to decode response"))
    }
  }
}

pub fn set_webhook(bot: Bot) -> Ret(Nil) {
  let url = "https://api.telegram.org/bot" <> bot.token <> "/setWebhook"
  let body = SetWebhook(bot.host <> "/" <> bot.token, ["inline_query"])
  let req = case request.to(url) {
    Ok(req) ->
      req
      |> request.set_header("content-type", "application/json")
      |> request.set_method(http.Post)
      |> request.set_body(request_body_to_json(body))
      |> Ok
    Error(err) -> Error(error.unexpected(err, "Failed to create request"))
  }
  let resp = case req {
    Ok(req) ->
      case httpc.send(req) {
        Ok(res) -> Ok(res)
        Error(err) -> Error(error.unexpected(err, "Failed to send request"))
      }
    Error(err) -> Error(error.unexpected(err, "Failed to send request"))
  }
  result.map(resp, decode_response_body)
  |> result.flatten
}
