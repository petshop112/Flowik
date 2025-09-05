export type MakeRequestFunction = <T = unknown>(
  url: string,
  options?: globalThis.RequestInit
) => Promise<T>;
