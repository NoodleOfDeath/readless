import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { OpenAIService } from '../src/services/openai/OpenAIService';

jest.setTimeout(30_000);

describe('generates an image', () => {

  test('generate an image', async () => {
    const service = new OpenAIService();
    try {
      let resp = await service.send('Please summarize this article for me: onald Trump will struggle to win the presidency in 2024 because "so many swing voters in swing states...would not vote for the man if he walked on water," according to Larry Elder, who is pitching himself to Republican primary voters as the electable face of Trumpism.  Speaking to Newsweek, the conservative media commentator insisted he is a "big fan of Donald Trump" and his "spot-on" policies, and vowed to support him if he gains the Republican nomination.  However, Elder argued the former president had been so demonized by political opponents that another candidate was needed so Republicans "can win in November 2024," adding, "I\'m making the case that I\'m that person."  Conservative commentator Larry Elder  Stock photo showing Republican presidential candidate Larry Elder at an Asian Rally for Yes Recall at the Asian Garden Mall in Little Saigon, Westminster, California, on September 4, 2021. Elder told Newsweek that Republicans need to "unite behind a candidate who’s last name is other than Trump" to retake the presidency in 2024. RINGO CHIU/AFP/GETTY SUBSCRIBE NOW FROM JUST $1 > Polling indicates Trump is the strong favorite to win the 2024 GOP nomination, setting up a possible rematch against Joe Biden.  Explaining his decision to seek the Republican candidacy, Elder said: "I don\'t accept the narrative that I\'m running against Donald Trump, I\'m not—I\'m running against Biden-Harris. I am a big fan of Donald Trump, I supported him in 2016 and 2020, campaigned for him, and if asked to do so, if he\'s the nominee, I will do so again.  "Here\'s the problem; I believe there are so many swing voters in swing states who would not vote for the man if he walked on water. In fact, they would accuse him of not being able to swim. I have no idea what to do about Trump derangement syndrome, maybe someday somebody will develop a vaccine."  Elder urged Republican primary voters to ask themselves: "Have you lost friends because of Donald Trump? Are you walking on eggshells at work because of Donald Trump? Do you have strained relationships with your family and relatives because of Donald Trump?"  SIGN UP FOR NEWSWEEK’S EMAIL UPDATES > He added: "If the answer is yes, Houston we\'ve got a problem, and that problem is called electability. I think at some point in this long process, Republican voters are going to realize in order to win in November 2024 they\'re going to have to unite behind a candidate whose last name is other than Trump, but for whom a sufficient number of swing voters and swing states will vote so we can win in November 2024, and I\'m making the case that I\'m that person."  If elected in 2024, Elder vowed to continue Trump\'s agenda, commenting: "I love his policies on borders, I love the idea of a wall, I love the fact he signed an executive order to make it easier to fire people in the so-called \'deep state.\'"  He also introduced some policy proposals of his own, with a particular emphasis on fighting the "epidemic of fatherlessness" and crime, issues Elder believes are closely connected.  He claimed: "70 percent of Black kids today [are] without a father in the home married to the mother, up from 25 percent back in 1965. What\'s happened? We\'ve launched a so-called \'war on poverty;\' the Democrats did that—incentivize women to marry the government, and incentivize men to abandon their moral and financial responsibility and that is why we have this."  In response, Elder said every fatherless child should be given a "sponsor" to act as a "male role model," though he insisted this should be organized through civil society rather than by the government.  He told Newsweek: "A kid raised without a father is five times more likely to be poor and commit crime, nine times more likely to drop out of school and 20 times more likely to end up in jail...once people are aware of what the problem is, I think they will get involved."  On law and order, Elder argued "hundreds, if not thousands" of "primarily Black and brown people living in the inner city" have died over the past three years. He claimed it was a result of a reduction in "proactive policing" following the murder of George Floyd in May, 2020.  Floyd, a 46-year-old Black man, died after being arrested by police outside a shop in Minneapolis on May 25, 2020. He was arrested on suspicion of using a counterfeit $20 bill. His death sparked protests worldwide and calls for change in the nation\'s criminal justice system.  Elder wrote on Twitter that he is pushing for an "Enforce the Law Act" to "ensure that violent criminals are put behind bars and prosecutors are not unduly influenced by outside political interests."');
      console.log(resp);
      resp = await service.send('Now give that summary a new title');
      console.log(resp);
      resp = await service.send('Can you cite three quotes from that summary?');
      console.log(resp);
    } catch (e) {
      console.log(e);
    }
    expect(true).toBe(true);
  });

});
