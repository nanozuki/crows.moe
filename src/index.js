import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const appElement = document.createElement('div');
appElement.id = 'root';
document.body.append(appElement);

const Root = () => (
  <App />
);

ReactDOM.render(<Root />, appElement);
