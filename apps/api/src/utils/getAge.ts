export const getAge = (date: string) => {
  const [year, month, day] = date.split('-');
  const today = new Date();
  const m = today.getMonth() - parseInt(month);
  let age = today.getFullYear() - parseInt(year);

  if (m < 0 || (m === 0 && today.getDate() < parseInt(day))) {
    age--;
  }

  return age;
};
