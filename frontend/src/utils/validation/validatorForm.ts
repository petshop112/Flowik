export const isEmpty = (s: string) => s.trim().length === 0;
export const onlyLettersAndSpaces = (s: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(s);
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const digitsBetween = (s: string, min: number, max: number) =>
  new RegExp(`^\\d{${min},${max}}$`).test(s);
export const lengthBetween = (s: string, min: number, max: number) =>
  s.length >= min && s.length <= max;
