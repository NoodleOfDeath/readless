import { LEXICON } from './lexicon';

// (empirically derived mean sentiment intensity rating increase for booster words)
export const B_INCR = 0.293;

export const B_DECR = -0.293;

// (empirically derived mean sentiment intensity rating increase for using
// ALLCAPs to emphasize a word)
export const C_INCR = 0.733;

export const N_SCALAR = -0.74;

export const REGEX_REMOVE_PUNCTUATION = new RegExp(
  /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g
);
// ` // <- to fix ide thinking grave accent in regex is starting a template quote

export const PUNC_LIST = [
  '.',
  '!',
  '?',
  ',',
  ';',
  ':',
  '-',
  '\'',
  '"',
  '!!',
  '!!!',
  '??',
  '???',
  '?!?',
  '!?!',
  '?!?!',
  '!?!?',
];

export const NEGATE = [
  'aint',
  'arent',
  'cannot',
  'cant',
  'couldnt',
  'darent',
  'didnt',
  'doesnt',
  'ain\'t',
  'aren\'t',
  'can\'t',
  'couldn\'t',
  'daren\'t',
  'didn\'t',
  'doesn\'t',
  'dont',
  'hadnt',
  'hasnt',
  'havent',
  'isnt',
  'mightnt',
  'mustnt',
  'neither',
  'don\'t',
  'hadn\'t',
  'hasn\'t',
  'haven\'t',
  'isn\'t',
  'mightn\'t',
  'mustn\'t',
  'neednt',
  'needn\'t',
  'never',
  'none',
  'nope',
  'nor',
  'not',
  'nothing',
  'nowhere',
  'oughtnt',
  'shant',
  'shouldnt',
  'uhuh',
  'wasnt',
  'werent',
  'oughtn\'t',
  'shan\'t',
  'shouldn\'t',
  'uh-uh',
  'wasn\'t',
  'weren\'t',
  'without',
  'wont',
  'wouldnt',
  'won\'t',
  'wouldn\'t',
  'rarely',
  'seldom',
  'despite',
];

// booster/dampener 'intensifiers' or 'degree adverbs'
// http://en.wiktionary.org/wiki/Category:EnglishDegreeAdverbs

export const BOOSTER_DICT = {
  absolutely: B_INCR,
  almost: B_DECR,
  amazingly: B_INCR,
  awfully: B_INCR,
  barely: B_DECR,
  completely: B_INCR,
  considerably: B_INCR,
  decidedly: B_INCR,
  deeply: B_INCR,
  effing: B_INCR,
  enormously: B_INCR,
  entirely: B_INCR,
  especially: B_INCR,
  exceptionally: B_INCR,
  extremely: B_INCR,
  fabulously: B_INCR,
  flippin: B_INCR,
  flipping: B_INCR,
  frickin: B_INCR,
  fricking: B_INCR,
  friggin: B_INCR,
  frigging: B_INCR,
  fucking: B_INCR,
  fully: B_INCR,
  greatly: B_INCR,
  hardly: B_DECR,
  hella: B_INCR,
  highly: B_INCR,
  hugely: B_INCR,
  incredibly: B_INCR,
  intensely: B_INCR,
  'just enough': B_DECR,
  'kind of': B_DECR,
  'kind-of': B_DECR,
  kinda: B_DECR,
  kindof: B_DECR,
  less: B_DECR,
  little: B_DECR,
  majorly: B_INCR,
  marginally: B_DECR,
  more: B_INCR,
  most: B_INCR,
  occasionally: B_DECR,
  particularly: B_INCR,
  partly: B_DECR,
  purely: B_INCR,
  quite: B_INCR,
  really: B_INCR,
  remarkably: B_INCR,
  scarcely: B_DECR,
  slightly: B_DECR,
  so: B_INCR,
  somewhat: B_DECR,
  'sort of': B_DECR,
  'sort-of': B_DECR,
  sorta: B_DECR,
  sortof: B_DECR,
  substantially: B_INCR,
  thoroughly: B_INCR,
  totally: B_INCR,
  tremendously: B_INCR,
  uber: B_INCR,
  unbelievably: B_INCR,
  unusually: B_INCR,
  utterly: B_INCR,
  very: B_INCR,
};

// check for special case idioms using a sentiment-laden keyword known to VADER
export const SPECIAL_CASE_IDIOMS = {
  'bad ass': 1.5,
  'cut the mustard': 2,
  'hand to mouth': -2,
  'kiss of death': -1.5,
  'the bomb': 3,
  'the shit': 3,
  'yeah right': -2,
};

// static methods

export const negated = (inputWords: string[], includeNT = true) => {
  /**
    Determine if input contains negation words
   */
  if (NEGATE.some((word) => inputWords.includes(word))) {
    return true;
  }
  if (includeNT && inputWords.some((word) => /n't/i.test(word))) {
    return true;
  }
  const i = inputWords.findIndex((e) => e === 'least');
  return i !== -1 && i > 0 && inputWords[i - 1] !== 'at';
};

export const normalize = (score: number, alpha = 15) => {
  /**
    Normalize the score to be between -1 and 1 using an alpha that
    approximates the max expected value
  */
  const normalizedScore = score / Math.sqrt(score * score + alpha);
  if (normalizedScore < -1.0) {
    return -1.0;
  } else if (normalizedScore > 1.0) {
    return 1.0;
  } else {
    return normalizedScore;
  }
};

export const allcapDifferential = (words: string[]) => {
  /**
    Check whether just some words in the input are ALL CAPS
  */

  let allcapWords = 0;
  for (let i = 0; i < words.length; i++) {
    if (isUpperPython(words[i])) {
      allcapWords += 1;
    }
  }
  const capDifferential = words.length - allcapWords;
  return capDifferential > 0 && capDifferential < words.length;
};

export const scalarIncDec = (
  word: string,
  valence: number,
  isCapDiff: boolean
) => {
  /**
      Check if the preceding words increase, decrease, or negate/nullify the
      valence
    */

  let scalar = 0.0;
  const wordLower = word.toLowerCase() as keyof typeof BOOSTER_DICT;
  if (wordLower in BOOSTER_DICT) {
    scalar = BOOSTER_DICT[wordLower];
    if (valence < 0) {
      scalar *= -1;
    }
    // check if booster/dampener word is in ALLCAPS (while others aren't)
    if (isCapDiff && isUpperPython(word)) {
      if (valence > 0) {
        scalar += C_INCR;
      } else {
        scalar -= C_INCR;
      }
    }
  }
  return scalar;
};

export const isUpperPython = (word: string) => {
  /**
      Python style "isupper" function. Requirements are that the string is at least one character in length,
      and does not consider an emoticon, e.g. :), as an uppercase word, but a string with special characters and only
      all caps characters is an uppercase word, e.g. ':)WORD' is true
   */
  if (word.length > 0) {
    return /^[^a-z]*[A-Z]+[^a-z]*$/g.test(word);
  }
  return false;
};

export class SentiText {

  text: string;
  wordsAndEmoticons: string[];
  isCapDiff: boolean;

  /**
    Identify sentiment-relevant string-level properties of input text
  */
  constructor(text: string) {
    this.text = text;
    this.wordsAndEmoticons = this.getWordsAndEmoticons();
    // doesn't separate words from adjacent punctuation (keeps emoticons & contractions)
    this.isCapDiff = allcapDifferential(this.wordsAndEmoticons);
  }

  getWordsPlusPunc() {
    /**
        Returns mapping of form:
        {
          'cat,': 'cat',
          ',cat': 'cat'
        }
      */

    // removes punctuation (but loses emoticons & contractions)
    const noPuncText = this.text.slice(0).replace(REGEX_REMOVE_PUNCTUATION, '');
    const words = noPuncText.split(/\s/);
    // removes singletons
    const wordsOnly = words.filter((word) => {
      return word.length > 1;
    });
    const wordsPuncDict: Record<string, string> = {};
    for (let j = 0; j < PUNC_LIST.length; j++) {
      for (let k = 0; k < wordsOnly.length; k++) {
        const pb = `${PUNC_LIST[j]}${wordsOnly[k]}`;
        const pa = `${wordsOnly[k]}${PUNC_LIST[j]}`;
        wordsPuncDict[pb] = wordsOnly[k];
        wordsPuncDict[pa] = wordsOnly[k];
      }
    }
    return wordsPuncDict;
  }

  getWordsAndEmoticons() {
    /**
      Removes leading and trailing puncutation
      Leaves contractions and most emoticons
      Does not preserve punc-plus-letter emoticons (e.g. :D)
    */

    const tokens = this.text.split(/\s/);
    const wordsPuncDict = this.getWordsPlusPunc();
    const wordsOnly = tokens.filter((token) => {
      return token.length > 1;
    });
    for (let i = 0; i < wordsOnly.length; i++) {
      if (wordsOnly[i] in wordsPuncDict) {
        wordsOnly[i] = wordsPuncDict[wordsOnly[i]];
      }
    }
    return wordsOnly;
  }

}

export class SentimentIntensityAnalyzer {

  /**
    Give a sentiment intensity score to sentences
  */

  static polarityScores(text: string) {
    /**
      Return a float for sentiment strength based on the input text.
      Positive values are positive valence, negative value are negative
      valence
    */

    const sentiText = new SentiText(text);
    let sentiments: number[] = [];
    const wordsAndEmoticons = sentiText.wordsAndEmoticons;
    for (let i = 0; i < wordsAndEmoticons.length; i++) {
      const valence = 0;
      const item = wordsAndEmoticons[i];
      if (
        (i < wordsAndEmoticons.length - 1 &&
          item.toLowerCase() === 'kind' &&
          wordsAndEmoticons[i + 1].toLowerCase() === 'of') ||
        item.toLowerCase() in BOOSTER_DICT
      ) {
        sentiments.push(valence);
        continue;
      }

      sentiments = SentimentIntensityAnalyzer.sentimentValence(
        valence,
        sentiText,
        item,
        i,
        sentiments
      );
    }

    sentiments = SentimentIntensityAnalyzer.butCheck(
      wordsAndEmoticons,
      sentiments
    );
    const valenceDict = SentimentIntensityAnalyzer.scoreValence(
      sentiments,
      text
    );
    return valenceDict;
  }

  static sentimentValence(
    valence: number,
    sentiText: SentiText,
    item: string,
    index: number,
    sentiments: number[]
  ) {
    const isCapDiff = sentiText.isCapDiff;
    const wordsAndEmoticons = sentiText.wordsAndEmoticons;
    const itemLowercase = item.toLowerCase() as keyof typeof LEXICON;
    if (itemLowercase in LEXICON) {
      // get the sentiment valence
      valence = LEXICON[itemLowercase];
      // check if sentiment laden word is in ALL CAPS (while others aren't)
      if (isUpperPython(item) && isCapDiff) {
        if (valence > 0) {
          valence += C_INCR;
        } else {
          valence -= C_INCR;
        }
      }

      for (let startIndex = 0; startIndex < 3; startIndex++) {
        if (
          index > startIndex &&
          !(
            wordsAndEmoticons[index - (startIndex + 1)].toLowerCase() in LEXICON
          )
        ) {
          // dampen the scalar modifier of preceding words and emoticons
          // (excluding the ones that immediately preceed the item) based
          // on their distance from the current item.
          let s = scalarIncDec(
            wordsAndEmoticons[index - (startIndex + 1)],
            valence,
            isCapDiff
          );
          if (startIndex === 1 && s !== 0) {
            s = s * 0.95;
          } else if (startIndex === 2 && s !== 0) {
            s = s * 0.9;
          }
          valence = valence + s;
          valence = this.neverCheck(
            valence,
            wordsAndEmoticons,
            startIndex,
            index
          );
          if (startIndex === 2) {
            valence = this.idiomsCheck(valence, wordsAndEmoticons, index);
          }
        }
      }

      valence = this.leastCheck(valence, wordsAndEmoticons, index);
    }

    sentiments.push(valence);
    return sentiments;
  }

  static leastCheck(
    valence: number,
    wordsAndEmoticons: string[],
    index: number
  ) {
    /**
      Check for negaion case using "least"
    */

    if (
      index > 1 &&
      wordsAndEmoticons[index - 1].toLowerCase() === 'least' &&
      !(wordsAndEmoticons[index - 1].toLowerCase() in LEXICON)
    ) {
      if (
        wordsAndEmoticons[index - 2].toLowerCase() !== 'at' &&
        wordsAndEmoticons[index - 2].toLowerCase() !== 'very'
      ) {
        valence = valence * N_SCALAR;
      }
    } else if (
      index > 0 &&
      wordsAndEmoticons[index - 1].toLowerCase() === 'least' &&
      !(wordsAndEmoticons[index - 1].toLowerCase() in LEXICON)
    ) {
      valence = valence * N_SCALAR;
    }

    return valence;
  }

  static butCheck(wordsAndEmoticons: string[], sentiments: number[]) {
    /**
      Check for modification in sentiment due to contrastive conjunction 'but'
    */
    let butIndex = wordsAndEmoticons.indexOf('but');
    if (butIndex === -1) {
      butIndex = wordsAndEmoticons.indexOf('BUT');
    }
    if (butIndex !== -1) {
      for (let i = 0; i < sentiments.length; i++) {
        const sentiment = sentiments[i];
        if (i < butIndex) {
          sentiments.splice(i, 1);
          sentiments.splice(i, 0, sentiment * 0.5);
        } else if (i > butIndex) {
          sentiments.splice(i, 1);
          sentiments.splice(i, 0, sentiment * 1.5);
        }
      }
    }
    return sentiments;
  }

  static idiomsCheck(
    valence: number,
    wordsAndEmoticons: string[],
    index: number
  ) {
    const onezero = `${wordsAndEmoticons[index - 1]} ${
      wordsAndEmoticons[index]
    }`;
    const twoonezero = `${wordsAndEmoticons[index - 2]} ${
      wordsAndEmoticons[index - 1]
    } ${wordsAndEmoticons[index]}`;
    const twoone = `${wordsAndEmoticons[index - 2]} ${
      wordsAndEmoticons[index - 1]
    }`;
    const threetwoone = `${wordsAndEmoticons[index - 3]} ${
      wordsAndEmoticons[index - 2]
    } ${wordsAndEmoticons[index - 1]}`;
    const threetwo = `${wordsAndEmoticons[index - 3]} ${
      wordsAndEmoticons[index - 2]
    }`;

    const sequences = [onezero, twoonezero, twoone, threetwoone, threetwo];

    for (let i = 0; i < sequences.length; i++) {
      if (sequences[i] in SPECIAL_CASE_IDIOMS) {
        valence =
          SPECIAL_CASE_IDIOMS[sequences[i] as keyof typeof SPECIAL_CASE_IDIOMS];
        break;
      }
    }

    if (wordsAndEmoticons.length - 1 > index) {
      const zeroone = `${wordsAndEmoticons[index]} ${
        wordsAndEmoticons[index + 1]
      }`;
      if (zeroone in SPECIAL_CASE_IDIOMS) {
        valence =
          SPECIAL_CASE_IDIOMS[zeroone as keyof typeof SPECIAL_CASE_IDIOMS];
      }
    }

    if (wordsAndEmoticons.length - 1 > index + 1) {
      const zeroonetwo = `${wordsAndEmoticons[index]} ${
        wordsAndEmoticons[index + 1]
      } ${wordsAndEmoticons[index + 2]}`;
      if (zeroonetwo in SPECIAL_CASE_IDIOMS) {
        valence =
          SPECIAL_CASE_IDIOMS[zeroonetwo as keyof typeof SPECIAL_CASE_IDIOMS];
      }
    }

    // check for booster/dampener bi-grams such as 'sort of' or 'kind of'
    if (threetwo in BOOSTER_DICT || twoone in BOOSTER_DICT) {
      valence += B_DECR;
    }

    return valence;
  }

  static neverCheck(
    valence: number,
    wordsAndEmoticons: string[],
    startIndex: number,
    index: number
  ) {
    if (startIndex === 0) {
      if (negated([wordsAndEmoticons[index - 1]])) {
        valence = valence * N_SCALAR;
      }
    }
    if (startIndex === 1) {
      if (
        wordsAndEmoticons[index - 2] === 'never' &&
        (wordsAndEmoticons[index - 1] === 'so' ||
          wordsAndEmoticons[index - 1] === 'this')
      ) {
        valence = valence * 1.5;
      } else if (negated([wordsAndEmoticons[index - (startIndex + 1)]])) {
        valence = valence * N_SCALAR;
      }
    }
    if (startIndex === 2) {
      if (
        (wordsAndEmoticons[index - 3] === 'never' &&
          (wordsAndEmoticons[index - 2] === 'so' ||
            wordsAndEmoticons[index - 2] === 'this')) ||
        wordsAndEmoticons[index - 1] === 'so' ||
        wordsAndEmoticons[index - 1] === 'this'
      ) {
        valence = valence * 1.25;
      } else if (negated([wordsAndEmoticons[index - (startIndex + 1)]])) {
        valence = valence * N_SCALAR;
      }
    }
    return valence;
  }

  static punctuationEmphasis(_: number, text: string) {
    /**
      Add emphasis from exclamation points and question marks
    */
    const epAmplifier = SentimentIntensityAnalyzer.amplifyEp(text);
    const qmAmplifier = SentimentIntensityAnalyzer.amplifyQm(text);
    const punctEmphAmplifier = epAmplifier + qmAmplifier;
    return punctEmphAmplifier;
  }

  static amplifyEp(text: string) {
    /**
      Check for added emphasis resulting from exclamation points (up to 4 of them)
    */
    let epCount = text.replace(/[^!]/g, '').length;
    if (epCount > 4) {
      epCount = 4;
    }
    // empirically derived mean sentiment intensity rating increase for exclamation points
    const epAmplifier = epCount * 0.292;
    return epAmplifier;
  }

  static amplifyQm(text: string) {
    /**
      Check for added emphasis resulting from question marks (2 or 3+)
    */
    const qmCount = text.replace(/[^?]/g, '').length;
    let qmAmplifier = 0;
    if (qmCount > 1) {
      if (qmCount <= 3) {
        // empirically derived mean sentiment intensity rating increase for question marks
        qmAmplifier = qmCount * 0.18;
      } else {
        qmAmplifier = 0.96;
      }
    }
    return qmAmplifier;
  }

  static siftSentimentScores(sentiments: number[]) {
    /**
      Want separate positive versus negative sentiment scores
    */
    let posSum = 0.0;
    let negSum = 0.0;
    let neuCount = 0;
    for (let i = 0; i < sentiments.length; i++) {
      const sentimentScore = sentiments[i];
      if (sentimentScore > 0) {
        posSum += sentimentScore + 1; // compensates for neutral words that are counted as 1
      } else if (sentimentScore < 0) {
        negSum += sentimentScore - 1; // when used with math.fabs(), compensates for neutrals
      } else {
        neuCount += 1;
      }
    }
    return [posSum, negSum, neuCount];
  }

  static scoreValence(sentiments: number[], text: string) {
    let pos = 0.0,
      neg = 0.0,
      neu = 0.0,
      compound = 0.0;
    if (sentiments && sentiments.length > 0) {
      let sumS = sentiments.reduce((a, b) => a + b, 0);
      // compute and add emphasis from punctuation in text
      const punctEmphAmplifier = SentimentIntensityAnalyzer.punctuationEmphasis(
        sumS,
        text
      );
      sumS += (sumS > 0 ? 1 : -1) * punctEmphAmplifier;
      const compoundSum = normalize(sumS);
      // discriminate between positive, negative and neutral sentiment scores
      const scores = SentimentIntensityAnalyzer.siftSentimentScores(sentiments);
      let posSum = scores[0];
      let negSum = scores[1];
      const neuCount = scores[2];
      if (posSum > Math.abs(negSum)) {
        posSum += punctEmphAmplifier;
      } else if (posSum < Math.abs(negSum)) {
        negSum -= punctEmphAmplifier;
      }
      const total = posSum + Math.abs(negSum) + neuCount;
      pos = parseFloat(Math.abs(posSum / total).toFixed(3));
      neg = parseFloat(Math.abs(negSum / total).toFixed(3));
      neu = parseFloat(Math.abs(neuCount / total).toFixed(3));
      compound = parseFloat(compoundSum.toFixed(4));
    }
    return {
      compound,
      neg,
      neu,
      pos,
    };
  }

}
