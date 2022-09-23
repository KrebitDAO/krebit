export const mergeArray = (arr: any[]): any[] => {
  const counts = {};

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  return Object.entries(counts).sort(
    (a, b) => (b[1] as number) - (a[1] as number)
  );
};
