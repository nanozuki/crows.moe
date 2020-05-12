import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import fs from 'fs';

import { App } from 'App';
import { log } from 'log';

/* eslint-disable import/no-dynamic-require */
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
/* eslint-enable import/no-dynamic-require */

let template;

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const context = {};
    const sheet = new ServerStyleSheet();
    let markup;
    let styleTags;
    try {
      markup = renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </StyleSheetManager>,
      );
      styleTags = sheet.getStyleTags();
    } catch (err) {
      log.error(err);
    } finally {
      sheet.seal();
    }

    if (context.url) {
      res.redirect(context.url);
    } else {
      if (!template) {
        const data = await fs.promises.readFile('./public/template.html');
        template = data.toString();
      }
      const cssAssets = assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : '';
      const clientJs = process.env.NODE_ENV === 'production'
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`;
      const html = template
        .replace('{{css-assets}}', cssAssets)
        .replace('{{client-js}}', clientJs)
        .replace('{{style-tags}}', styleTags)
        .replace('{{markup}}', markup);
      res.status(200).send(html);
    }
  });

export { server };
