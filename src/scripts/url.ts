#!/usr/bin/env ts-node

const DAY = 1000 * 60 * 60 * 24;
const YEAR = 1000 * 60 * 60 * 24 * 365;

function generateDynamicUrls(
  url: string,
  params?: string | string[][],
  index = -1
): string[] {
  const urls: string[] = [];
  if (Array.isArray(params)) {
    urls.push(
      ...params
        .map((arr, i) => arr.map((p) => generateDynamicUrls(url, p, i)))
        .flat(2)
    );
  } else {
    urls.push(
      url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
        const offset = Number($2 ?? 0) + Number($3 ?? 0);
        switch ($1) {
          case "YYYY":
            return new Date(Date.now() + offset * YEAR)
              .getFullYear()
              .toString();
          case "M":
            return (((new Date().getMonth() + offset) % 12) + 1).toString();
          case "MM":
            return (((new Date().getMonth() + offset) % 12) + 1)
              .toString()
              .padStart(2, "0");
          case "MMMM":
            return new Date(
              `2050-${((new Date().getMonth() + offset) % 12) + 1}-01`
            ).toLocaleString("default", {
              month: "long",
            });
          case "D":
            return new Date(Date.now() + offset * DAY).getDate().toString();
          case "DD":
            return new Date(Date.now() + offset * DAY)
              .getDate()
              .toString()
              .padStart(2, "0");
          default:
            if (params && !Number.isNaN(Number($1))) {
              const i = Number($1);
              if (i === index) return params;
            }
            return $0;
        }
      })
    );
  }
  return urls;
}
console.log(
  generateDynamicUrls("https://www.bustle.com/archive/${MMMM}/${YYYY}/${1}", [
    ["style", "entertainment"],
  ])
);
