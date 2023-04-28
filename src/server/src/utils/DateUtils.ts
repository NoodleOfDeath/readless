import ms from 'ms';

export const TIME_EXPR = /(\d\d?)\s*(a\.?m\.?|p\.?m\.?)|(\d\d?)[.:](\d\d?)(?:[.:](\d\d?))?(?:\s*(a\.?m\.?|p\.?m\.?))?(?:.*(?:\s*(ACDT|ACS?T|AES?T|AKDT|AKS?T|BS?T|CES?T|CDT|CS?T|EDT|ES?T|IS?T|JS?T|MDT|MSK|NZS?T|PDT|PS?T|UTC)))?/i;

export const DATE_EXPR = /(\d\d?\s*(?:h|h(?:ou)?rs?|m|min(?:ute)s?))\s*ago|(?:(\d\d?)([-./])(\d\d?)\3(\d{4}|\d{2})|(\d{4})([-./])(\d\d?)\7(\d\d?)|(?:(\d\d?)(?:st|nd|rd|th)?\s*)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d\d?)(?:st|nd|rd|th)?)?(?:[,\s]\s*(\d{4})?))(?:.*(?:\s*(ACDT|ACS?T|AES?T|AKDT|AKS?T|BS?T|CES?T|CDT|CS?T|EDT|ES?T|IS?T|JS?T|MDT|MSK|NZS?T|PDT|PS?T|UTC)))?|(\d\d\d\d+)/i;

export function monthToString(month: number | string) {
  const m = parseInt(`${month}`);
  if (Number.isNaN(m)) {
    return month;
  }
  return new Date(`2023-${m}-07`).toLocaleString('en-US', { month: 'long' });
}

export function parseDate(context: string) {
  const date = new Date(context.trim());
  if (!Number.isNaN(date.valueOf()) && date.valueOf() > 0) {
    return date;
  }
  const dateMatches = context.match(DATE_EXPR);
  const timeMatches = context.match(TIME_EXPR);
  let year = String(new Date().getFullYear());
  let month = monthToString(new Date().getMonth() + 1);
  let day = String(new Date().getDate());
  let hour = 0, min = 0, sec = 0, amOrPm = '';
  let timezone = '';
  if (dateMatches) {
    const [_0, relative, month1, _3, day1, year1, year2, _7, month2, day2, day3, month3, day4, year3, tz = '', timestamp] = dateMatches;
    if (relative) {
      return new Date(Date.now() - ms(relative.replace(/h(?:ou)?rs?/, 'h').replace(/m(?:in)?s?/, 'm')));
    }
    const datetime = parseInt(timestamp);
    if (!Number.isNaN(datetime)) {
      if (!Number.isNaN(new Date(datetime)).valueOf()) {
        return new Date(datetime);
      }
    }
    timezone = tz;
    year = year1 ?? year2 ?? year3 ?? String(new Date().getFullYear());
    month = monthToString(month1 ?? month2 ?? month3 ?? new Date().getMonth() + 1);
    day = day1 ?? day2 ?? day3 ?? day4 ?? String(new Date().getDate());
  }
  if (timeMatches) {
    const [_0, hour1, amOrPm1, hour2, min1, sec1, amOrPm2, timezone2] = timeMatches;
    hour = !Number.isNaN(parseInt(hour1 ?? hour2)) ? parseInt(hour1 ?? hour2) : 0;
    min = !Number.isNaN(parseInt(min1)) ? parseInt(min1) : 0;
    sec = !Number.isNaN(parseInt(sec1)) ? parseInt(sec1) : 0;
    amOrPm = (amOrPm1 ?? amOrPm2 ?? '').replace(/\./g, '');
    if (timezone2) {
      timezone = timezone2;
    }
  }
  const dateMatch = [`${month} ${day}, ${String(year).length === 2 ? `20${year}` : year} ${hour}:${min}:${sec} ${amOrPm ? amOrPm : (hour < 12) ? 'am' : 'pm'}`, timezone.replace(/^(A[CEK]|CE|NZ|[BCEIJP])T$/, ($0, $1) => `${$1}ST`)].join(' ');
  const parsedDate = new Date(dateMatch);
  return parsedDate;
}

export function sortDates(...dates: Date[]) {
  return [...dates].filter((d) => !Number.isNaN(d.valueOf())).sort((a, b) => { 
    return a.valueOf() - b.valueOf();
  });
}

export function minDate(...dates: Date[]) {
  const sortedDates = sortDates(...dates);
  if (sortedDates.length === 0) {
    return new Date('invalid');
  }
  return sortedDates[0];
}

export function maxDate(...dates: Date[]) {
  const sortedDates = sortDates(...dates);
  if (sortedDates.length === 0) {
    return new Date('invalid');
  }
  return sortedDates[sortedDates.length - 1];
}