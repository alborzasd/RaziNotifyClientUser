const PersianDate = require('persian-date');

export function customFormat(dateObj: any) {
  const oldPersianDate = new PersianDate(dateObj);
  const currentPersianDate = new PersianDate();

  // diff method has bug for start of day, so 1 second is added to both
  const oldDay = new PersianDate(oldPersianDate.startOf('day').second(1)); // given date at midnight
  const currentDay = new PersianDate(
    currentPersianDate.startOf('day').second(1),
  ); //current date at midnight
  const daysPassed = currentDay.diff(oldDay, 'days');

  // current: 1403/04/04 --> result: 1402/05/01
  // current: 1403/12/14 --> result: 1403/01/01
  const firstDayOfNextMonthInPrevYear = new PersianDate([
    currentDay.year() - 1,
    currentDay.month(),
  ])
    .endOf('month')
    .startOf('day')
    .add('days', 1)
    .second(1);

  if (oldDay.diff(firstDayOfNextMonthInPrevYear) <= 0) {
    return oldPersianDate.format('YYYY/MM/DD');
  }
  if (daysPassed >= 7) {
    return oldPersianDate.format('D MMMM');
  }
  if (daysPassed >= 1) {
    return oldPersianDate.format('dddd');
  }

  // today
  return oldPersianDate.format('HH:mm');
}
