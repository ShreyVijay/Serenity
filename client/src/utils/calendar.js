export function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  // padding before month starts
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  // actual days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}
