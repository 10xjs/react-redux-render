import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import renderMiddleware from 'http-middleware-metalab/middleware/render';
import createWait from 'redux-promise-wait/create-wait';
import escape from 'htmlescape';

import createRender from './create-render';
import doctype from './doctype';
import Page from './component/page';
import { httpRequest, httpError } from './action';

const CSS_FILE = /\.css$/;
const JS_FILE = /\.js$/;

const renderPage = doctype(createRender)(renderToStaticMarkup, Page);

export const defaultMapState = (state, /* req */) => {
  const { render: { status, title, path, locale } } = state;
  return {
    status,
    title,
    path,
    locale,
  };
};

export const defaultMapAssets = (state,  req) => {
  const { assets } = req;

  const styles = assets.filter(({ name }) => CSS_FILE.test(name));
  const scripts = assets.filter(({ name }) => JS_FILE.test(name));

  return {
    styles,
    scripts: [ {
      id: 'state',
      type: 'text/json',
      content: escape(state),
    }, ...scripts ],
  };
};

export const createRenderHandler = ({
  mapState = defaultMapState,
  mapAssets = defaultMapAssets,
  renderRoot,
}) => (req, res, store) => {
  const renderRootAsync = createWait(renderRoot, store);

  const sendResponse = (markup) => {
    const state = store.getState();

    const stateProps = mapState(state, req);
    const assetProps = mapAssets(state, req);
    const pageMarkup = renderPage({ ...stateProps, ...assetProps, markup });

    return {
      markup: pageMarkup,
      assets: assetProps,
      state: stateProps,
    };
  };

  return renderRootAsync({ store }).then(sendResponse);
};

export const createDefaultRenderRoot = (staticRender, rootComponent) =>
  createRender(
    staticRender ? renderToStaticMarkup : renderToString,
    rootComponent,
  );

/**
 * Create render middleware.
 *
 * @function
 *
 * @argument {Object} options An options object.
 *
 * @param {Component} options.rootComponent Your root app component. Receives
 * the Redux store as as a prop when rendered.
 *
 * @param {Function} options.createStore Return a new Redux store.
 *
 * @param {Function=} options.renderRoot Use this instead of
 * `options.rootComponent` if your app has a more complicated entry point.
 * Receives the Redux store as a  arguments and returns a string of markup.
 *
 * @param {Function=} options.mapState Returns an object with the shape
 * `{ status, title, path, locale }`.
 *
 * @param {Function=} options.mapAssets Receives the Redux state and the request
 * object as arguments returns an object with the shape
 * `{ styles[], scripts[] }`.
 *
 * @param {Bool=} options.staticRender Use `reactDOM.renderToStaticMarkup` when
 * rendering `options.rootComponent`. Has no effect if `options.renderRoot` is
 * specified.
 *
 * @returns {Function} A http middleware function.
 */
export default ({
  rootComponent,
  createStore,
  renderRoot,
  mapState,
  mapAssets,
  staticRender = false,
}) => {
  const request = (req, res, store) => store.dispatch(httpRequest(req));
  const error = (err, req, res, store) => store.dispatch(httpError(err, req));

  const finalRenderRoot = renderRoot || createDefaultRenderRoot(
    staticRender,
    rootComponent,
  );

  const render = createRenderHandler({
    mapState,
    mapAssets,
    renderRoot: (...args) => {
      return finalRenderRoot(...args);
    },
  });

  return renderMiddleware({
    request,
    error,
    createStore,
    render,
  });
};
