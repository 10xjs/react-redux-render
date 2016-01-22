# React Redux Render

HTTP middleware for rendering React Redux apps on the server.

[![Build Status](https://travis-ci.org/nealgranger/react-redux-render.svg?branch=master)](https://travis-ci.org/nealgranger/react-redux-render)
[![Coverage Status](https://coveralls.io/repos/github/nealgranger/react-redux-render/badge.svg?branch=master)](https://coveralls.io/github/nealgranger/react-redux-render?branch=master)

### Installation

```
npm install --save react-redux-render
```

## Example

*`server.js`*

```js
import http from 'http';
import compose from 'lodash/function/compose';
import { connect } from 'http-middleware-metalab';
import base from 'http-middleware-metalab/base';
import webpack from 'http-middleware-metalab/webpack';
import send from 'http-middleware-metalab/middleware/send';
import empty from 'http-middleware-metalab/middleware/empty';

import renderReactRedux from 'react-redux-render';

import Root from './containers/root';
import createStore from './store';

const createApp = compose(
  base(),
  webpack({ assets: { stats: './build/client/stats.json' } }),

  renderReactRedux({
    rootComponent: Root,
    createStore,
  }),
  
  send(),
  empty
);

export default connect(createApp(), http.createServer());
```

## Config options

Required

- **`rootComponent`**`: Component` - Your root app component. Receives the Redux Store as a single prop when rendered.
- **`createStore`**`: Function` Return a new Redux store.

Optional

- **`renderRoot`**`: Function` - Use this instead of `options.rootComponent` if your app has a more complicated entry point. Receives the Redux store as a  arguments and returns a string of markup.
- **`mapState`**`: Function` - Returns an object with the shape `{ status, title, path, locale }`.
- **`mapAssets`**`: Function` - Receives the Redux state and the request object as arguments returns an object with the shape `{ styles[], scripts[] }`.
- **`staticRender`**`: Boolean` - Use `reactDOM.renderToStaticMarkup` when rendering `options.rootComponent`. Has no effect if `options.renderRoot` is specified.
