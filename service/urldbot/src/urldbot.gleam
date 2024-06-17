import envoy
import gleam/io
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
  bot_from_env()
  |> result.map(bot_api.set_webhook)
  |> io.debug
}
