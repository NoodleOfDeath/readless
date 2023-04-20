import ms from 'ms';

const DATE_EXPR = /(?:(\d\d?)\/(\d\d?)\/\/(\d{4}))|(?:(\d\d?)(?:st|nd|rd|th)?\s*)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d\d?)(?:st|nd|rd|th)?)?[,\s]\s*(\d{4})(?:.*?\s+(\d\d?):(\d\d?)(?:\s*(am|pm))?)?(?:\s+(ET|EST|UDT))?|(\d\d?\s*(?:h|h(?:ou)?rs?|m|min(?:ute)s?))(?:\s*ago)?/i;

export function parseAnyDate(date: string) {
  const dateMatches = date.match(DATE_EXPR);
  let dateMatch: string;
  if (dateMatches) {
    const [_, d1, m1, y1, d2, m2, d3, y2, h1, min1, amOrPm, tz = 'EST', relative] = dateMatches;
    const day = d1 ?? d2 ?? d3;
    const month = m1 ? new Date(`2023-${ m1 + 1 }-01`).toLocaleString('en-US', { month: 'long' }) : m2;
    const year = y1 ?? y2;
    const min = min1;
    const hour = h1;
    dateMatch = `${month} ${day}, ${year}`;
    if (min && hour) {
      dateMatch = `${dateMatch} ${hour}:${min} ${amOrPm ? amOrPm : ''}`;
    }
    if (tz) {
      dateMatch = [dateMatch, tz.replace(/([ECMP])T$/, ($0, $1) => `${$1}ST`).replace('AK', 'AST')].join(' ');
    }
    if (relative) {
      dateMatch = new Date(Date.now() - ms(relative)).toString();
    }
    console.log(dateMatch);
    return new Date(dateMatch);
  }
  return null;
}