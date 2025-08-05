export type MakeRequestFunction = <T = unknown>(
  url: string,
  options?: RequestInit
) => Promise<T>;
