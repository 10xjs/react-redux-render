import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { HTTP_REQUEST, HTTP_ERROR, SET_TITLE } from '../../src/action/types';
import { httpRequest, httpError, setTitle } from '../../src/action/index';

chai.use(sinonChai);

describe('actions', () => {
  it('httpRequest', () => {
    expect(httpRequest('req')).to.deep.equal({
      type: HTTP_REQUEST,
      payload: 'req',
    });
  });

  it('httpError', () => {
    expect(httpError('err', 'req')).to.deep.equal({
      type: HTTP_ERROR,
      payload: { err: 'err', req: 'req' },
    });
  });

  it('setTitle', () => {
    expect(setTitle('title')).to.deep.equal({
      type: SET_TITLE,
      payload: 'title',
    });
  });
});

