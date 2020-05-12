import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import { App } from 'App';
import { log } from 'log';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
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
      res.status(200).send(
        `<!doctype html>
    <html lang="zh-CN">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
        ${process.env.NODE_ENV === 'production'
    ? `<script src="${assets.client.js}" defer></script>`
    : `<script src="${assets.client.js}" defer crossorigin></script>`}
      <meta name="crows.moe" content="Nanozuki's website" />
      <link rel="manifest" href="./manifest.json" />
      <title>crows.moe</title>
      <script>
        (function(d) {
          var config = {
            kitId: 'oza8qmh',
            scriptTimeout: 3000,
            async: true
          },
          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);
      </script>
      ${styleTags}
    </head>
    <body>
      <script type="text/javascript">
        (function() {
          function setDataThemeAttribute(theme) {
            document.querySelector('html').setAttribute('data-theme', theme);
          }
          
          var preferDarkQuery = '(prefers-color-scheme: dark)';
          var mql = window.matchMedia(preferDarkQuery);
          var supportsColorSchemeQuery = mql.media === preferDarkQuery;
          var localStorageTheme = null;
          try {
            localStorageTheme = localStorage.getItem('color-scheme');
          } catch (err) {}
          var localStorageExists = localStorageTheme !== null;
        
          if (localStorageExists) {
            setDataThemeAttribute(localStorageTheme);
          } else if (supportsColorSchemeQuery && mql.matches) {
            setDataThemeAttribute('dark');
          }
        })();
      </script>
      <div id="root">${markup}</div>
    </body>
</html>`,
      );
    }
  });

export default server;
