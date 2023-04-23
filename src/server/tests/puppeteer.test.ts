import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

jest.setTimeout(30_000);

import { Outlet } from '../src/api/v1/schema/resources/outlet/Outlet.model';
import { Loot, PuppeteerService } from '../src/services/puppeteer';

describe('crawl', () => {
  test('crawl-arstechnica', async () => {
    const outlet = Outlet.OUTLETS.arstechnica;
    const urls = await PuppeteerService.crawl(outlet);
    expect(urls.length).toBeGreaterThan(0);
  });
});

const LOOT: { [ Key in keyof typeof Outlet.OUTLETS]?: Pick<Loot, 'url' | 'authors' | 'date'> } = {
  abc: {
    authors: ['Shannon K. Crawford', 'Luis Martinez'],
    date: new Date('2023-04-23T14:52:00.000Z'),
    url: 'https://abcnews.go.com/International/us-embassy-staff-sudan-evacuated-amid-fighting/story?id=98767748',
  },
  advocate: {
    authors: ['Alex Cooper'],
    date: new Date('2023-04-23T15:18:00.000Z'),
    url: 'https://www.advocate.com/crime/kokomo-city-koko-da-doll',
  },
  aei: {
    authors: ['Robert Manzer'],
    date: new Date('2023-04-20T04:00:00.000Z'),
    url: 'https://www.aei.org/research-products/report/the-american-universitys-path-to-illiberalism/',
  },
  apnews: {
    authors: ['MATTHEW LEE', 'TARA COPP', 'AAMER MADHANI'],
    date: new Date('2023-04-23T05:47:09.000Z'),
    url: 'https://apnews.com/article/american-embassy-personnel-sudan-evacuated-airlift-45bca52da8c65914d48c18d6ad9d065c?utm_source=homepage&utm_medium=TopNews&utm_campaign=position_01',
  },
  arstechnica: {
    authors: ['Kenna Hughes-Castleberry'],
    date: new Date('2023-04-23T05:47:09.000Z'),
    url: 'https://arstechnica.com/science/2023/04/the-strange-tragic-story-of-egypts-foremost-female-nuclear-scientist/',
  },
  atlantic: {
    authors: ['Mark Leibovich'],
    date: new Date('2023-04-22T12:30:00.000Z'),
    url: 'https://www.theatlantic.com/politics/archive/2023/04/chris-christie-interview-trump-2024-election/673818/',
  },
  barrons: {
    authors: ['Lawrence C. Strauss'],
    date: new Date('2023-04-21T04:00:00.000Z'),
    url: 'https://www.barrons.com/articles/at-t-cash-flow-dividend-stock-earnings-fea3533-1a9ce2d3f5fb?mod=RTA',
  },
  bbc: {
    authors: ['Holly Honderich'],
    date: new Date('2023-04-22T01:53:48.000Z'),
    url: 'https://www.bbc.com/news/world-us-canada-65356390',
  },
  billboard: {
    authors: [],
    date: new Date('2023-04-21T04:00:00.000Z'),
    url: 'https://www.billboard.com/music/music-news/chloe-bailey-beyonce-renaissance-world-tour-opener-response-1235312795/',
  },
  bleepingcomputer: {
    authors: [ 'Ionut Ilascu' ],
    date: new Date('2023-04-23T17:32:00.000Z'),
    url: 'https://www.bleepingcomputer.com/news/security/hackers-can-breach-networks-using-data-on-resold-corporate-routers/',
  },
  bloomberg: {
    authors: [ 'Eliza Ronalds-Hannon', 'Jeannette Neumann' ],
    date: new Date('2023-04-23T14:29:00.000Z'),
    url: 'https://www.bloomberg.com/news/articles/2023-04-23/retailer-bed-bath-beyond-files-for-chapter-11-in-new-jersey?srnd=premium',
  },
  businessinsider: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.businessinsider.com/celebrity-speaker-wild-money-drugs-alcohol-hunter-thompson-2023-4',
  },
  bustle: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.bustle.com/life/the-miami-curse-vacations-friends-drama',
  },
  buzzfeed: {
    authors: [],
    date: new Date('placeholder'),
    url: 'placeholder',
  },
  cbsnews: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.cbsnews.com/boston/news/new-hampshire-wrong-way-operator-charged-with-drunk-driving-on-i-93/',
  },
  cnbc: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.cnbc.com/2023/04/23/hbo-netflix-have-evolved-away-from-each-other.html',
  },
  cnn: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.cnn.com/2023/04/23/health/abortion-lessons-jane-wellness/index.html',
  },
  coindesk: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.coindesk.com/web3/2023/04/22/judge-rules-bored-ape-yacht-club-ripoff-nfts-violated-yuga-copyright/',
  },
  cryptoglobe: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.cryptoglobe.com/latest/2023/04/miss-universe-el-salvador-2022-encourages-women-to-embrace-the-bitcoin-world-after-launching-ordinals-collection/',
  },
  csis: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://features.csis.org/hiddenreach/china-polar-research-facility/',
  },
  defenseone: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.defenseone.com/threats/2023/04/some-11k-ukrainians-have-had-least-some-us-training-spring-offensive-looms/385492/',
  },
  enews: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.eonline.com/news/1372154/how-love-is-blinds-amber-pike-is-shading-the-show',
  },
  espn: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.espn.com/nba/story/_/id/36268249/grizzlies-dillon-brooks-ejected-flagrant-2-lebron-james',
  },
  essence: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.essence.com/culture/jalen-hurts-nfl-essence-cover/',
  },
  ew: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://ew.com/movies/ghosted-preview-chris-evans-ana-de-armas-adrien-brody/',
  },
  forbes: {
    authors: [],
    date: new Date('2023-04-21T22:51:00.000Z'),
    url: 'https://www.forbes.com/sites/alisondurkee/2023/04/21/mifepristone-supreme-court-keeps-abortion-pills-legal-at-least-for-now-extending-earlier-pause-on-ruling/',
  },
  foreignpolicy: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://foreignpolicy.com/2023/04/22/turkey-presidential-election-erdogan-akp-personality-cults-military-earthquake-economy/',
  },
  fortune: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://fortune.com/2023/04/23/fortune-history-groupthink-trophy-wife-hedge-fund-henry-paypal-mafia/',
  },
  foxnews: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.foxnews.com/media/gen-z-voters-highlight-picks-2024-star-studded-gop-lineup-need-real-leadership#&_intcmp=fnhpbt1,hp1bt',
  },
  gizmodo: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://gizmodo.com/twitter-elon-musk-blue-check-verified-removed-memes-1850363062',
  },
  guardian: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.theguardian.com/us-news/2023/apr/23/trump-chris-sununu-republican-primary-2024',
  },
  hill: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://thehill.com/homenews/media/3962900-what-fox-news-dominion-settlement-means-for-its-next-major-legal-fight/',
  },
  huffpost: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.huffpost.com/entry/abortion-donald-trump-iowa_n_64454990e4b03c1b88c7a55d',
  },
  inverse: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.inverse.com/science/the-future-of-earth-editors-letter',
  },
  kotaku: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://kotaku.com/pokemon-trading-cards-tgc-eevee-eeveelution-yu-nagaba-a-1850363705',
  },
  ksl: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.ksl.com/article/50625269/utah-geological-survey-monitoring-100-landslide-locations-across-the-state',
  },
  latimes: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.latimes.com/california/story/2023-04-23/pete-aguilar-congress-latino-democrat-redlands',
  },
  lifewire: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.lifewire.com/googles-ai-chatbot-bard-can-now-help-you-code-software-7483561',
  },
  mashable: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://mashable.com/article/twitter-blue-28-signups',
  },
  menshealth: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.menshealth.com/health/a43498777/daytime-tv-doctor-requiem/',
  },
  natgeo: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.nationalgeographic.com/premium/graphics/asian-elephants-behavior-coexistence-survival-feature',
  },
  nbcnews: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.nbcnews.com/health/health-news/covid-vaccine-side-effects-tinnitus-may-linked-inflammation-rcna80675',
  },
  newsweek: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.newsweek.com/ai-accidents-set-skyrocket-this-year-1795928',
  },
  newyorker: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.newyorker.com/culture/the-new-yorker-interview/how-allan-gurganus-became-a-writer',
  },
  npr: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.npr.org/podcasts/510368/taking-cover',
  },
  out: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.out.com/film/nathan-lane',
  },
  people: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://people.com/royals/prince-louis-5th-birthday-photos-not-taken-kate-middleton/',
  },
  politico: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.politico.com/news/magazine/2023/04/21/political-violence-2024-magazine-00093028',
  },
  popmechs: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.popularmechanics.com/space/moon-mars/a43633761/blowing-up-the-moon/',
  },
  reuters: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.reuters.com/world/africa/us-france-evacuate-diplomats-sudan-battles-rage-2023-04-23/',
  },
  rstone: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.rollingstone.com/culture/culture-features/indian-boarding-school-survivors-abuse-interviews-1234721724/',
  },
  science: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.science.org/doi/10.1126/sciimmunol.add8454',
  },
  sciencedaily: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.sciencedaily.com/releases/2023/04/230419125056.htm',
  },
  space: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.space.com/the-expanse-dragon-tooth-comic-series-creators',
  },
  street: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.thestreet.com/technology/elon-musk-shares-stunning-starship-video-and-photo',
  },
  sundaytimes: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.thetimes.co.uk/article/diane-abbott-has-labour-whip-suspended-over-jewish-racism-claims-tzg8v87k3',
  },
  telegraph: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.telegraph.co.uk/world-news/2023/04/23/el-salvador-president-nayib-bukele-crime-crackdown-police/',
  },
  time: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://time.com/6273585/ron-desantis-donor-robert-bigelow/',
  },
  usatoday: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.usatoday.com/story/news/world/2023/04/23/sudan-war-live-updates/11724633002/',
  },
  usnews: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.usnews.com/news/world/articles/2023-04-20/global-militaries-converge-on-sudan-as-violence-escalates',
  },
  vbeat: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://venturebeat.com/ai/why-everyone-is-talking-about-generative-ai-not-just-the-experts/',
  },
  vice: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.vice.com/en/article/dy3vem/heres-how-you-can-get-in-on-facebooks-dollar725-million-class-action-settlement',
  },
  vox: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.vox.com/2023/4/15/23684493/sudan-rival-armed-forces-violence',
  },
  wired: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.wired.com/story/my-balls-out-quest-to-achieve-the-perfect-scrotum/',
  },
  wsj: {
    authors: [],
    date: new Date('placeholder'),
    url: 'https://www.wsj.com/articles/another-biden-trump-presidential-race-in-2024-looks-more-likely-19d88039?mod=mhp',
  },
};

describe('loot', () => {
  for (const [name, exp] of Object.entries(LOOT)) {
    test(`loot-${name}`, async () => {
      const loot = await PuppeteerService.loot(exp.url, Outlet.OUTLETS[name]);
      expect(loot).toBeDefined();
      expect(loot.url).toBe(exp.url);
      expect(loot.content.length).toBeGreaterThan(0);
      console.log(loot.content, loot.date, loot.authors);
      if (exp.authors.length > 0) {
        expect(loot.authors.length).toBe(exp.authors.length);
        for (const author of loot.authors) {
          expect(exp.authors.includes(author)).toBe(true);
        }
      }
      expect(Number.isNaN(loot.date.valueOf())).toBe(false);
      //expect(loot.date.toISOString()).toBe(exp.date.toISOString());
    });
  }
});
