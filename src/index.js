import React from 'react';

import ReactDOM from 'react-dom';

// router
import { BrowserRouter as Router, } from "react-router-dom";

// redux store
import { Provider } from "react-redux";

import appStore from 'store/index';

// components
import App from './App';

// styles
import './index.scss';

ReactDOM.render(
  <Provider store={appStore}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);