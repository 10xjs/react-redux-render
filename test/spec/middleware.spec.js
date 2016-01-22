import { createElement } from 'react';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import renderReactRedux, {
  defaultMapState,
  defaultMapAssets,
  createDefaultRenderRoot,
} from '../../src/middleware';

import { HTTP_REQUEST, HTTP_ERROR, SET_TITLE } from '../../src/action/types';
import { setTitle } from '../../src/action/index';

chai.use(sinonChai);

const Root = ({ text }) => <span>{ text }</span>;

describe('renderReactRedux', () => {
  describe('middleware', () => {
    let request;
    let error;
    let dispatch;
    let middleware;
    let req;
    let renderRoot;
    let store;

    beforeEach(() => {
      dispatch = sinon.spy();
      request = sinon.spy();
      req = { url: '/test' };
      renderRoot = sinon.spy();

      store = {
        dispatch,
        waitStore: {
          dispatch: (val) => (val),
          getState: () => ({ actions: [], stats: [] }),
        },
        getState: () => ({}),
      };

      middleware = renderReactRedux({
        renderRoot,
        createStore: () => (store),
      })({ request, error });
    });

    it('should dispatch a request action', () => {
      middleware.request(req, null);
      expect(dispatch).to.have.been.calledWith({
        type: HTTP_REQUEST,
        payload: req,
      });
    });

    it('should dispatch an error action', () => {
      const err = new Error();
      middleware.error(new Error(), req, null);
      expect(dispatch).to.have.been.calledWith({
        type: HTTP_ERROR,
        payload: { req, err },
      });
    });

    it('should call renderRoot with `{store}`', () => {
      middleware.request(req, null);
      expect(renderRoot).to.have.been.calledWith({ store });
    });
  });

  describe('actions', () => {
    it('setTitle', () => {
      expect(setTitle('test')).to.deep.equal({
        type: SET_TITLE,
        payload: 'test',
      });
    });
  });

  describe('defaultMapState', () => {
    it('should retreive required values from `state.render`', () => {
      const state = { render: {
        status: 200,
        title: 'test',
        path: 'test',
        locale: 'en-CA',
      } };

      expect(defaultMapState(state)).to.deep.equal(state.render);
    });
  });

  describe('defaultMapAssets', () => {
    it('should extract correct assets from the request object', () => {
      const jsFile = { name: 'test.js' };
      const cssFile = { name: 'test.css' };
      const req = { assets: [ jsFile, cssFile ] };
      const state = { foo: 'bar' };

      const styles = [ cssFile ];
      const scripts = [ {
        id: 'state',
        content: JSON.stringify(state),
        type: 'text/json',
      }, jsFile ];

      const assets = defaultMapAssets(state, req);

      expect(assets.scripts).to.deep.equal(scripts);
      expect(assets.styles).to.deep.equal(styles);
    });
  });

  describe('createDefaultRenderRoot', () => {
    it('should render markup', () => {
      const render = createDefaultRenderRoot(false, Root);

      expect(render({ text: 'test'})).to.be.a.string;
    });

    it('should render static markup', () => {
      const render = createDefaultRenderRoot(true, Root);

      expect(render({ text: 'test'})).to.equal('<span>test</span>');
    });
  });
});
