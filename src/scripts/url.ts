#!/usr/bin/env ts-node

const DAY = 1000 * 60 * 60 * 24;
const YEAR = 1000 * 60 * 60 * 24 * 365;

function generateDynamicUrl(url: string, params?:  string | string[][], index?: number = -1): string[] {
  const urls: string[] = [];
  if (typeof params === 'string') {
    urls.push(url
    .replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
      const offset = Number($2 ?? 0) + Number($3 ?? 0);
      switch($1) {
        case 'YYYY':
          return new Date(Date.now() + (offset * YEAR)).getFullYear().toString();
        case 'M':
          return (((new Date().getMonth() + offset) % 12) + 1).toString();
        case 'MM':
          return (((new Date().getMonth() + offset) % 12) + 1).toString().padStart(2, '0');
        case 'MMMM': 
          return new Date(`2050-${(((new Date().getMonth() + offset) % 12) + 1)}-01`).toLocaleString('default', { month: 'long' });
        case 'D':
           return new Date(Date.now() + (offset * DAY)).getDate().toString();
        case 'DD':
          return new Date(Date.now() + (offset * DAY)).getDate().toString().padStart(2, '0');
        default:
          if(params && !Number($1).isNaN()) {
            const i = Number($1);
            if (i === index + 1)
              return params;
          }
          return $0;
      }
    }));
  } else {
    urls.push(...params.map((arr, i) => arr.map((p) => generateDynamicUrl(url, p, i)).flat()));
  }
  return urls;
}
  
console.log(generateDynamicUrl(process.argv.slice(2)[0]), [['style', 'entertainment']]);