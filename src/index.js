import http from 'http';

import { log } from 'log';

let app = require('./server').server;

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, (error) => {
  if (error) {
    log.error(error);
  }
  log.info('🚀 started');
});

if (module.hot) {
  log.info('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    log.info('🔁  HMR Reloading `./server`...');

    try {
      /* eslint-disable global-require */
      app = require('./server').server;
      /* eslint-enable global-require */
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      log.error(error);
    }
  });
}
