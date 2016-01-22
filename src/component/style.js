import { createElement, Element } from 'react';

export default ({ url, type, content }, i) : Element => {
  return url ?
    <link rel='stylesheet' href={url} key={i}/> :
    <style type={type} key={i} dangerouslySetInnerHTML={{
      __html: content,
    }}/>;
};
