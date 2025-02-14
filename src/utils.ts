import LZString from "lz-string";

export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: number;

  return (...args: Parameters<F>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const compressText = (text: string): string => {
  return LZString.compressToEncodedURIComponent(text);
};

export const decompressText = (compressed: string): string => {
  try {
    const decoded = decodeURIComponent(compressed);
    return LZString.decompressFromEncodedURIComponent(decoded) || "";
  } catch (e) {
    console.error("Failed to decompress text:", e);
    return "";
  }
};

export const createShareableUrl = (text: string): string => {
  const compressed = compressText(text);
  return `${window.location.origin}${window.location.pathname}#${compressed}`;
};

export const calculateScrollPercentage = (element: HTMLElement) => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  if (scrollHeight <= clientHeight) return 0;
  return Math.max(0, Math.min(1, scrollTop / (scrollHeight - clientHeight)));
};

export const setScrollPercentage = (element: HTMLElement, percentage: number) => {
  const { scrollHeight, clientHeight } = element;
  if (scrollHeight <= clientHeight) return;
  
  // Ограничиваем percentage и округляем до целых пикселей
  const maxScroll = scrollHeight - clientHeight;
  const targetScroll = Math.round(Math.max(0, Math.min(1, percentage)) * maxScroll);
  
  // Проверяем, есть ли реальное изменение
  if (Math.abs(element.scrollTop - targetScroll) < 1) return;
  
  element.scrollTop = targetScroll;
};
