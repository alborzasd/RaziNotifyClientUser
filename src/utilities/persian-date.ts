import {convertToPersianDigit} from './string-utilities';

const PersianDate = require('persian-date');

// too fucking slow function (I mean CPU intensive)
// funcking deprecated
// implemented in java in a separate thread
// export function customFormat(dateObj: any) {
//   // if (isNaN(dateObj)) {
//   //   return '...';
//   // }

//   const oldPersianDate = new PersianDate(dateObj);
//   const currentPersianDate = new PersianDate();

//   // diff method has bug for start of day, so 1 second is added to both
//   const oldDay = new PersianDate(oldPersianDate.startOf('day').second(1)); // given date at midnight
//   const currentDay = new PersianDate(
//     currentPersianDate.startOf('day').second(1),
//   ); //current date at midnight
//   const daysPassed = currentDay.diff(oldDay, 'days');

//   // current: 1403/04/04 --> result: 1402/05/01
//   // current: 1403/12/14 --> result: 1403/01/01
//   const firstDayOfNextMonthInPrevYear = new PersianDate([
//     currentDay.year() - 1,
//     currentDay.month(),
//   ])
//     .endOf('month')
//     .startOf('day')
//     .add('days', 1)
//     .second(1);

//   if (oldDay.diff(firstDayOfNextMonthInPrevYear) <= 0) {
//     return oldPersianDate.format('YYYY/MM/DD');
//   }
//   if (daysPassed >= 7) {
//     return oldPersianDate.format('D MMMM');
//   }
//   if (daysPassed >= 1) {
//     return oldPersianDate.format('dddd');
//   }

//   // today
//   return oldPersianDate.format('HH:mm');
// }

export function getPersianDateFormat(dateISOStr: string) {
  const date = new Date(dateISOStr);

  if (isNaN(date)) {
    return '---';
  }

  const persianDate = new PersianDate(date);

  return persianDate.format('YYYY/MM/DD');
}

export function getPersianFormattedHour(dateISOStr: string): string {
  const date = new Date(dateISOStr);

  if (isNaN(date)) {
    return '';
  }

  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  const result = `${hour}:${minute}`;
  return convertToPersianDigit(result);
}

export function isLessThan24Hour(dateISOStr: string) {
  const date = new Date(dateISOStr);

  if (isNaN(date)) {
    return '';
  }

  const currentDate = new Date();

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  return currentDate.getTime() - date.getTime() < oneDayInMilliseconds;
}
