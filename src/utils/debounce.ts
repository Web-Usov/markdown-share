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
