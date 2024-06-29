import { toJalaali } from 'jalaali-js';

export function convertUtcToJalali(utcDate: string) {
  // Parse the UTC date string to a Date object
  const date = new Date(convertUTCtoLocal(utcDate));

  // Convert the date to a Jalali date
  const jalaliDate = toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  // const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes} - ${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`;
}

function convertUTCtoLocal(utcDateString: string): string {
  const utcDate = new Date(utcDateString);
  const offsetMilliseconds = new Date().getTimezoneOffset() * 60000;
  const localDate = new Date(utcDate.getTime() - offsetMilliseconds);

  const localDateString = localDate.toLocaleDateString('en-US');
  const localTimeString = localDate.toLocaleTimeString('en-US');

  return `${localDateString} ${localTimeString}`;
}
