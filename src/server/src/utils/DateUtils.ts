import ms from 'ms';

const DATE_EXPR = /(?:(?:(\d\d?)\/(\d\d?)\/(\d{2}|\d{4}))|(?:(\d\d?)(?:st|nd|rd|th)?\s*)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d\d?)(?:st|nd|rd|th)?)?[,\s]\s*(\d{4}))(?:.*?\s*(\d\d?):(\d\d?)(?:\s*(am|pm))?)?(?:\s*(ACDT|ACS?T|AES?T|AKDT|AKS?T|BS?T|CES?T|CDT|CS?T|EDT|ES?T|IS?T|JS?T|MDT|MSK|NZS?T|PDT|PS?T|UTC))?|(\d\d?\s*(?:h|h(?:ou)?rs?|m|min(?:ute)s?))\s*ago|(\d\d\d+$)/i;

export function parseDate(context: string, timezone = 'UTC') {
  const date = new Date(context.trim());
  if (!Number.isNaN(date.valueOf()) && date.valueOf() > 0) {
    return date;
  }
  const dateMatches = context.match(DATE_EXPR);
  let dateMatch: string;
  let parsedDate: Date;
  if (dateMatches) {
    const [_, m1, d1, y1, d2, m2, d3, y2, h1, min1, amOrPm, tz = timezone, relative, timestamp] = dateMatches;
    const day = d1 ?? d2 ?? d3;
    const month = m1 ? new Date(`2023-${ !Number.isNaN(parseInt(m1)) ? String(parseInt(m1)) : m1 }-01`).toLocaleString('en-US', { month: 'long' }) : !Number.isNaN(parseInt(m2)) ? String(parseInt(m2)) : m2;
    const year = y1 ?? y2 ?? new Date().getFullYear();
    const min = min1 ?? '00';
    const hour = h1 ?? '00';
    dateMatch = `${month} ${day}, ${String(year).length === 2 ? `20${year}` : year} ${hour}:${min} ${amOrPm ? amOrPm : (min + hour === '0000') ? 'am' : ''}`;
    if (relative) {
      parsedDate = new Date(Date.now() - ms(relative));
    } else
    if (timestamp && !Number.isNaN(Number.parseInt(timestamp))) {
      parsedDate = new Date(Number.parseInt(timestamp));
    } else
    if (tz) {
      parsedDate = new Date([dateMatch, tz.replace(/^(A[CEK]|CE|NZ|[BCEIJP])T$/, ($0, $1) => `${$1}ST`)].join(' '));
    }
    return parsedDate;
  }
  return new Date('invalid');
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