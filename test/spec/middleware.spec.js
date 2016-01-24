import { createElement } from 'react';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import renderReactRedux, {
  defaultMapState,
  defaultMapAssets,
  createDefaultRenderRoot,
} from '../../src/middleware';

import { HTTP_REQUEST, HTTP_ERROR } from '../../src/action/types';

chai.use(sinonChai);

const Root = ({ text }) => <span>{ text }</span>;

describe('middleware', () => {
  let dispatch;
  let app;
  let req;
  let res;
  let renderRoot;
  let store;
  let next;
  let state;

  beforeEach(() => {
    dispatch = sinon.spy();
    req = {
      url: '/test',
      assets: [],
    };
    res = {};
    renderRoot = sinon.spy();
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
    state = { render: {
      status: 200,
      title: 'test',
      path: 'test',
      locale: 'en-CA',
    } };
    store = {
      dispatch,
      waitStore: {
        dispatch: (val) => (val),
        getState: () => ({ actions: [], stats: [] }),
      },
      getState: () => (state),
    };

    app = renderReactRedux({
      renderRoot,
      createStore: () => (store),
    })(next);
  });

  describe('request', () => {
    it('should dispatch a request action', (done) => {
      app.request(req, res).then(() => {
        expect(dispatch).to.have.been.calledWithMatch({ type: HTTP_REQUEST });
        expect(next.error).to.not.have.been.called;
        done();
      });
    });
  });

  describe('error', () => {
    it('should dispatch an error action', (done) => {
      const err = new Error();
      app.error(err, req, res).then(() => {
        expect(dispatch).to.have.been.calledWithMatch({ type: HTTP_ERROR });
        done();
      });
    });
  });

  it('should call renderRoot with `{store}`', (done) => {
    app.request(req, res).then(() => {
      expect(renderRoot).to.have.been.calledWith({ store });
      done();
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
