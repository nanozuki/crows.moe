import http from 'http';

import { log } from 'log';

let app = require('./server').default;

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
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      log.error(error);
    }
  });
}
