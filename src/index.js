import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const appElement = document.createElement('div');
appElement.id = 'root';
document.body.append(appElement);

if (module.hot) {
  module.hot.accept();
}

const Root = () => (
  <App />
);

ReactDOM.render(<Root />, document.getElementById('root'));
