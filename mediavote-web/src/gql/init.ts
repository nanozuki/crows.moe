import * as doc from './docs';

function clientOpt(): { url: string } {
  if (process.env.NODE_ENV === 'production') {
    return { url: 'http://mediavote.crows.moe/api/query' };
  }
  return { url: 'http://127.0.0.1:8080/api/query' };
}

export { doc, clientOpt };
