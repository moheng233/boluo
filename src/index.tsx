import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { getRoot } from './utils/browser';
import { Provider } from 'react-redux';
import { store } from './store';
import { baseStyle } from './styles/atoms';
import { Global } from '@emotion/react';

ReactDOM.render(
  <Provider store={store}>
    <Global styles={baseStyle} />
    <App />
  </Provider>,
  getRoot()
);
