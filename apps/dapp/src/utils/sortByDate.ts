export const sortByDate = (date1: Date, date2: Date, order: string = 'asc') => {
  if (order === 'asc') {
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
  }

  if (order === 'des') {
    if (date1 < date2) return 1;
    if (date1 > date2) return -1;
  }

  return 0;
};
