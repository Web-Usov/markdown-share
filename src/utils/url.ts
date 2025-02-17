import { compressText } from "./compression";

export const createShareableUrl = (text: string): string => {
  const compressed = compressText(text);
  return `${window.location.origin}${window.location.pathname}#${compressed}`;
};
