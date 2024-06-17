import gleam/string

pub type Err {
  UnexpectedError(String)
  BotApiError(Int, String)
}

pub fn unexpected(err: err, message: String) -> Err {
  UnexpectedError(message <> ": " <> string.inspect(err))
}

pub type Ret(a) =
  Result(a, Err)
