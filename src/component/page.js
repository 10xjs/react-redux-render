import { createElement, Element } from 'react';

import Script from './script';
import Style from './style';

/**
 * Global 'page' object used to render every page.
 * @returns {Element} Generated page.
 */
export default function Page({
  markup = '',
  scripts = [],
  styles = [],
  title = '',
  path = '/',
  locale = 'en-US',
}) : Element {
  return (
    <html lang={locale}>
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1'/>
        <meta name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>

        <title>{title}</title>
        {styles.map((style) => <Style {...style}/>)}
      </head>
      <body data-path={path}>
        <div id='content' dangerouslySetInnerHTML={{ __html: markup }}/>
        {scripts.map((script) => <Script {...script}/>)}
      </body>
    </html>
  );
}
