import ms from 'ms';

const DATE_EXPR = /(?:(?:(\d\d?)\/(\d\d?)\/(\d{4}))|(?:(\d\d?)(?:st|nd|rd|th)?\s*)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d\d?)(?:st|nd|rd|th)?)?[,\s]\s*(\d{4}))(?:.*?\s*(\d\d?):(\d\d?)(?:\s*(am|pm))?)?(?:\s*(ET|EDT|EST|UDT))?|(\d\d?\s*(?:h|h(?:ou)?rs?|m|min(?:ute)s?))(?:\s*ago)?|(\d\d\d+$)/i;

export function parseAnyDate(date: string, timezone = 'UTC') {
  const dateMatches = date.match(DATE_EXPR);
  let dateMatch: string;
  let parsedDate: Date;
  if (dateMatches) {
    const [_, d1, m1, y1, d2, m2, d3, y2, h1, min1, amOrPm, tz = timezone, relative, timestamp] = dateMatches;
    const day = d1 ?? d2 ?? d3;
    const month = m1 ? new Date(`2023-${ m1 + 1 }-01`).toLocaleString('en-US', { month: 'long' }) : (m2 + 1);
    const year = y1 ?? y2 ?? new Date().getFullYear();
    const min = min1 ?? '00';
    const hour = h1 ?? '00';
    dateMatch = `${month} ${day}, ${year} ${hour}:${min} ${amOrPm ? amOrPm : (min + hour === '0000') ? 'am' : ''}`;
    if (relative) {
      parsedDate = new Date(Date.now() - ms(relative));
    } else
    if (timestamp && !Number.isNaN(Number.parseInt(timestamp))) {
      parsedDate = new Date(Number.parseInt(timestamp));
    } else
    if (tz) {
      parsedDate = new Date([dateMatch, tz.replace(/([ECMP])T$/, ($0, $1) => `${$1}ST`).replace('AK', 'AST')].join(' '));
    }
    return parsedDate;
  }
  return new Date('invalid');
}