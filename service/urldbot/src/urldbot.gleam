import gleam/http.{Post}
import gleam/http/request
import gleam/http/response
import gleam/httpc
import gleam/result

import bot_api
import error

pub fn bot_from_env() {
  {
    use token <- result.try(envoy.get("URLDBOT_TOKEN"))
    use host <- result.try(envoy.get("URLDBOT_HOST"))
    Ok(bot_api.Bot(token, host))
  }
  |> result.map_error(error.unexpected(_, "Failed to get bot from env"))
}

pub fn main() {
  let req =
    request.to("https://api.telegram.org/bot" <> bot_token <> "/getMe")
    |> result.map(request.set_header(_, "content-type", "application/json"))
    |> result.map(request.set_method(_, Post))

  let resp = result.try(req, httpc.send)

  // We get a response record back
  resp.status
  |> should.equal(200)

  resp
  |> response.get_header("content-type")
  |> should.equal(Ok("application/json"))

  resp.body
  |> should.equal("{\"message\":\"Hello World\"}")

  Ok(resp)
}
