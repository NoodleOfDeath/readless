import axios from 'axios';
import { load } from 'cheerio';
import ms from 'ms';
import { Op } from 'sequelize';

import {
  Outlet,
  Queue,
  SiteMapParams,
  Summary,
} from '../api/v1/schema';
import { DBService } from '../services';

async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  await Outlet.initOutlets();
  pollForNews();
  cleanBadSummaries();
}

function generateDynamicUrls(
  url: string,
  params?: SiteMapParams,
  index = -1
): string[] {
  const urls: string[] = [];
  if (Array.isArray(params)) {
    urls.push(...params
      .map((arr, i) => arr.map((p) => generateDynamicUrls(url, p, i)))
      .flat(2));
  } else {
    urls.push(url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
      const offset = Number($2 ?? 0) + Number($3 ?? 0);
      switch ($1) {
      case 'YYYY':
        return new Date(Date.now() + offset * ms('1y'))
          .getFullYear()
          .toString();
      case 'M':
        return (((new Date().getMonth() + offset) % 12) + 1).toString();
      case 'MM':
        return (((new Date().getMonth() + offset) % 12) + 1)
          .toString()
          .padStart(2, '0');
      case 'MMMM':
        return new Date(`2050-${((new Date().getMonth() + offset) % 12) + 1}-01`).toLocaleString('default', { month: 'long' });
      case 'D':
        return new Date(Date.now() + offset * ms('1d')).getDate().toString();
      case 'DD':
        return new Date(Date.now() + offset * ms('1d'))
          .getDate()
          .toString()
          .padStart(2, '0');
      default:
        if (params && !Number.isNaN(Number($1))) {
          const i = Number($1);
          if (i === index) {
            return params;
          }
        }
        return $0;
      }
    }));
  }
  return urls;
}

async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: outlets } = await Outlet.findAndCountAll();
    const queue = await Queue.from(Queue.QUEUES.siteMaps);
    for (const outlet of outlets) {
      const { name, siteMaps } = outlet.toJSON();
      console.log(`fetching sitemaps for ${name}`);
      if (siteMaps.length === 0) {
        console.log('dafuq. no sitemaps?');
        continue;
      }
      for (const siteMap of siteMaps) {
        const {
          params, keepQuery, selector, attribute, 
        } = siteMap;
        const queryUrls = generateDynamicUrls(siteMap.url, params);
        for (const queryUrl of queryUrls) {
          console.log(`fetching ${queryUrl} from ${name}...`);
          try {
            const { data } = await axios.get(queryUrl, { timeout: 10_000 });
            const $ = load(data);
            const cheerio = $(selector);
            const urls = [...cheerio] 
              .map((e) => {
                const href = (
                  attribute && $(e).attr(attribute)
                    ? $(e).attr(attribute)
                    : $(e).text()
                ).trim();
                const url = new URL(queryUrl);
                const fullUrl = new URL(/^https?:\/\//i.test(href)
                  ? href
                  : [url.origin, href.replace(/^\//, '')].join('/'));
                return keepQuery
                  ? fullUrl.href
                  : [fullUrl.origin, fullUrl.pathname].join('');
              })
              .filter((u) => !!u);
            if (urls.length === 0) {
              continue;
            }
            for (const url of urls) {
              await queue.add(
                url,
                { outlet: name, url }
              );
            }
          } catch (e) {
            console.error(e);
            continue;
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(pollForNews, ms('30m'));
  }
}

async function cleanBadSummaries() {
  console.log('cleaning bad summaries!');
  try {
    await Summary.destroy({
      where: {
        [Op.or]: [
          { title: { [Op.iRegexp]: '^i\'m (?:sorry|apologize|sign\\s?up)' } },
          { title: { [Op.iRegexp]: '\\w{200,}' } },
          { longSummary: { [Op.iRegexp]: '^i\'m (?:sorry|apologize|sign\\s?up)' } },
          { summary: { [Op.iRegexp]: '^i\'m (?:sorry|apologize|sign\\s?up)' } },
        ],
      },
    });
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(cleanBadSummaries, ms('30m'));
  }
}

main();
