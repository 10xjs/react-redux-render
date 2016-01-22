import { Component, createElement } from 'react';

export default (render : Function, component : Component) : Function =>
  (props : Object) : Function => render(createElement(component, props));
