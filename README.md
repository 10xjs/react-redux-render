# render-preset-react-redux

HTTP middleware for rendering React Redux apps on the server.

## Example

*`server.js`*

```js
...

import renderReactRedux from 'render-preset-react-redux';

import Root from './containers/root';
import createStore from './store';

const createApp = compose(

  // Base & webpack HTTP middleware.
  ...

  renderReactRedux({
    rootComponent: Root,
    createStore,
  });
)

```

## Config options

Required

- **`rootComponent`**`: Component` - Your root app component. Receives the Redux Store as a single prop when rendered.
- **`createStore`**`: Function` Return a new Redux store.

Optional

- **`renderRoot`**`: Function` - Use this instead of `options.rootComponent` if your app has a more complicated entry point. Receives the Redux store as a  arguments and returns a string of markup.
- **`mapState`**`: Function` - Returns an object with the shape `{ status, title, path, locale }`.
- **`mapAssets`**`: Function` - Receives the Redux state and the request object as arguments returns an object with the shape `{ styles[], scripts[] }`.
- **`getHeaders`**`: Function` - Receives the Redux state and the request  object as arguments and return an object with header key-value pairs.
- **`staticRender`**`: Boolean` - Use `reactDOM.renderToStaticMarkup` when rendering `options.rootComponent`. Has no effect if `options.renderRoot` is specified.

####Todo
- [ ] tests
- [ ] `Content-Security-Policy` header
