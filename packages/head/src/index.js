import { h, render, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";

const headTags = [];
let nextID = 0;

function useID() {
  const [shouldIncrementID, setShouldIncrementID] = useState(true);
  const [id] = useState(nextID);

  // prevent incrementing `id` on subsequent renders
  useEffect(() => {
    setShouldIncrementID(false);
  }, []);

  if (shouldIncrementID) {
    nextID += 1;
  }

  return id;
}

export function flush() {
  nextID = 0;
  return headTags.splice(0, headTags.length);
}

function setChildAttributes(child, id) {
  return cloneElement(child, { "data-jsx": undefined, "data-n-head": id });
}

function HeadTag({ children: child }) {
  const id = useID();
  child = setChildAttributes(child, id);

  if (typeof window === "undefined") {
    headTags.push(child);
  } else {
    const replaceNode =
      document.querySelector(`[data-n-head="${id}"]`) ||
      document.createElement(child.type);

    useEffect(() => {
      return () => {
        replaceNode.remove();
      };
    }, []);

    render(child, document.head, replaceNode);
  }

  return null;
}

export const Title = props => (
  <HeadTag>
    <title {...props} />
  </HeadTag>
);

export const Base = props => (
  <HeadTag>
    <base {...props} />
  </HeadTag>
);

export const Link = props => (
  <HeadTag>
    <link {...props} />
  </HeadTag>
);

export const Style = ({ children: __html, ...props }) => (
  <HeadTag>
    <style dangerouslySetInnerHTML={{ __html }} {...props} />
  </HeadTag>
);

export const Meta = props => (
  <HeadTag>
    <meta {...props} />
  </HeadTag>
);

export const Script = ({ children: __html, ...props }) => (
  <HeadTag>
    <script dangerouslySetInnerHTML={{ __html }} {...props} />
  </HeadTag>
);

export const NoScript = props => (
  <HeadTag>
    <noscript {...props} />
  </HeadTag>
);

export const Template = props => (
  <HeadTag>
    <template {...props} />
  </HeadTag>
);
