import { HTTP_REQUEST, HTTP_ERROR, SET_TITLE } from './action/types';

const initialState = {
  path: '/',
  locale: 'en-us',
  title: 'React Redux Render',
  status: 200,
};

export const httpRequest = (state, { payload }) => ({
  ...state,
  path: payload.url,
  locale: payload.locale,
});

export const httpError = (state, { payload: { err } }) => ({
  ...state,
  status: err.status || err.statusCode || 500,
});

export const setTitle = (state, { payload }) => ({
  ...state,
  title: payload,
});

export default (state = initialState, action) => {
  const map = {
    [HTTP_REQUEST]: httpRequest,
    [HTTP_ERROR]: httpError,
    [SET_TITLE]: setTitle,
    default: (state) => state,
  };

  return (map[action.type] || map.default)(state, action);
};
