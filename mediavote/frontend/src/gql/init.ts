import * as doc from "./docs";

function clientOpt(): { url: string } {
  return { url: "http://127.0.0.1:8080/query" };
}

export { doc, clientOpt };
