/// <reference types="vite/client" />

// To SVG as React component
declare module '*.svg?react' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// To SVG as file (URL)
declare module '*.svg' {
  const src: string;
  export default src;
}
