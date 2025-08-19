/// <reference types="vite/client" />

// Para SVG como componente React
declare module '*.svg?react' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// Para SVG como archivo (URL)
declare module '*.svg' {
  const src: string;
  export default src;
}
