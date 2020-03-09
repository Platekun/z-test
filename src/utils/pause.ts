export const pause = (t: number) =>
  new Promise(resolve => setTimeout(resolve, t));
