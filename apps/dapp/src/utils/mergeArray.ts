export const mergeArray = (array: any[]): any[] => {
  return Array.from(new Set(array));
};
