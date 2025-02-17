export const calculateScrollPercentage = (element: HTMLElement) => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  if (scrollHeight <= clientHeight) return 0;
  return Math.max(0, Math.min(1, scrollTop / (scrollHeight - clientHeight)));
};

export const setScrollPercentage = (element: HTMLElement, percentage: number) => {
  const { scrollHeight, clientHeight } = element;
  if (scrollHeight <= clientHeight) return;
  
  const maxScroll = scrollHeight - clientHeight;
  const targetScroll = Math.round(Math.max(0, Math.min(1, percentage)) * maxScroll);
  
  if (Math.abs(element.scrollTop - targetScroll) < 1) return;
  
  element.scrollTop = targetScroll;
};
