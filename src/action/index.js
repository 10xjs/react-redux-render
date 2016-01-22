import { HTTP_REQUEST, HTTP_ERROR, SET_TITLE } from './types';

export const httpRequest = (req) => ({
  type: HTTP_REQUEST,
  payload: req,
});

export const httpError = (err, req) => ({
  type: HTTP_ERROR,
  payload: { err, req },
});

export const setTitle = (title) => ({
  type: SET_TITLE,
  payload: title,
});
