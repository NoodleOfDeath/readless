import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import '@tensorflow/tfjs-backend-cpu';

import { Publisher, Summary } from '../src/api/v1/schema';
import { DBService, ScribeService } from '../src/services';
import { compareSimilarity } from '../src/utils';

jest.setTimeout(180_000);

describe('summary unit tests', () => {

  test('associateSibling', async () => {
    try {
      await DBService.prepare();
      const summary = await Summary.findByPk(1441);
      if (!summary) {
        throw new Error('Summary not found');
      }
      await summary.dropAllSiblings();
      await summary.associateWith(1443);
      await summary.associateWith(1317);
      await summary.associateWith(1318);
      const sibling = await Summary.findByPk(1320);
      if (!sibling) {
        throw new Error('Sibling not found');
      }
      await sibling.associateWith(1340);
      console.log(await summary.getSiblings());
      await sibling.associateWith(1318);
      const siblings = await summary.getSiblings();
      expect(siblings).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });

  test('compare similarity', async () => {
    let score = await compareSimilarity(
      'Israeli warplanes strike refugee camps in Gaza as calls for cease-fire persist, while the Biden administration approves emergency weapons sale to Israel. Death toll rises to 21,672 in the ongoing conflict.',
      'Israeli warplanes strike urban refugee camps in Gaza as Biden administration approves emergency weapons sale to Israel amidst international cease-fire calls.'
    );
    console.log(score);
    expect(score).toBeGreaterThan(0.75);
    score = await compareSimilarity(
      'A series of major earthquakes in Japan prompted a tsunami warning, but the government later downgraded the alert. More than a dozen strong quakes were reported in the Japan Sea, with an initial major tsunami warning for Ishikawa and lower-level warnings for the western coast and Hokkaido. The tsunami warning was eventually downgraded to a regular warning, with the possibility of waves up to 10 feet.',
      'A powerful 7.6-magnitude earthquake strikes central Japan\'s western coastline, prompting tsunami alerts and warnings for residents to evacuate. The quake causes power outages and the collapse of buildings in Ishikawa. Tsunami waves reach up to 5 meters in height. Officials urge residents to stay alert and prepare for further quakes.'
    );
    console.log(score);
    expect(score).toBeGreaterThan(0.75);
    score = await compareSimilarity(
      'Donald Trump\'s ex-attorney Ty Cobb describes Trump\'s legal tactics as \'frivolous\' attempts at delaying his trials. Trump faces four criminal trials this year, including charges related to alleged election interference and mishandling of classified documents. He maintains his innocence and accuses federal prosecutors of targeting him for political purposes. Legal analysts speculate that Trump may seek to delay his trials to potentially pardon himself. Cobb criticizes Trump\'s attacks against prosecutors, calling them a \'formulaic game.\'',
      'Green Day\'s lead singer, Billie Joe Armstrong, took a dig at former president Donald Trump during a New Year\'s Eve performance by swapping out a lyric in their protest song \'American Idiot\' to declare, \'I\'m not a part of the MAGA agenda.\' This isn\'t the first time Green Day has criticized Trump on stage, and they have a history of taking digs at him in their music videos. Fans have also used the song \'American Idiot\' to protest and troll Trump. Armstrong has even considered renouncing his U.S. citizenship if Trump is re-elected.'
    );
    console.log(score);
    expect(score).toBeLessThan(0.75);
    score = await compareSimilarity(
      'Donald Trump\'s ex-attorney Ty Cobb describes Trump\'s legal tactics as \'frivolous\' attempts at delaying his trials. Trump faces four criminal trials this year, including charges related to alleged election interference and mishandling of classified documents. He maintains his innocence and accuses federal prosecutors of targeting him for political purposes. Legal analysts speculate that Trump may seek to delay his trials to potentially pardon himself. Cobb criticizes Trump\'s attacks against prosecutors, calling them a \'formulaic game.\'',
      'Gardner Minshew and Jonathan Taylor help the Indianapolis Colts secure a 23-20 victory over the Las Vegas Raiders, keeping them in the AFC playoff chase. The Colts will head into their regular-season finale with three straight home wins and are tied with the Houston Texans atop the AFC South standings. The Jacksonville Jaguars also have a share of the division lead.'
    );
    console.log(score);
    expect(score).toBeLessThan(0.75);
  });
  
  test('summarize', async () => {
    await DBService.prepare();
    await ScribeService.prepare();
    await Publisher.prepare();
    const publisher = await Publisher.findOne({ where: { name: 'espn' } });
    if (!publisher) {
      throw new Error('Publisher not found');
    }
    const summary = await ScribeService.readAndSummarize({
      publisher,
      url: 'https://www.espn.com/mlb/insider/insider/story/_/id/39210708/mlb-free-agency-trade-braves-red-sox-chris-sale-2023-24',
    });
    expect(summary).toBeDefined();
  });

});
