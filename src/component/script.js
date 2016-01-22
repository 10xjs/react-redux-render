import { createElement, Element } from 'react';

export default ({ url, content, type, id }, i) : Element => {
  return url ?
    <script type={type} src={url} key={i}/> :
    <script type={type} key={i} id={id} dangerouslySetInnerHTML={{
      __html: content,
    }}/>;
};
