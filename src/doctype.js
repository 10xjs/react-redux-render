import { Component } from 'react';

/**
 * Render enhancer which prepends a doctype.
 *
 * @param   {Function} next [description]
 * @returns {Function}      [description]
 */
export default (next) : Function =>
  (render : Function, component : Component) : Function =>
    (props : Object) : String =>
      `<!DOCTYPE html>${next(render, component)(props)}`;
