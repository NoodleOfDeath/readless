#!/usr/bin/env ts-node

import '@tensorflow/tfjs-backend-cpu';

import tf from '@tensorflow/tfjs-node';
import use from '@tensorflow-models/universal-sentence-encoder';

const SENTENCES = [
  'Israeli warplanes strike refugee camps in Gaza as calls for cease-fire persist, while the Biden administration approves emergency weapons sale to Israel. Death toll rises to 21,672 in the ongoing conflict.',
  'Israeli warplanes strike urban refugee camps in Gaza as Biden administration approves emergency weapons sale to Israel amidst international cease-fire calls.',
  // 'A series of major earthquakes in Japan prompted a tsunami warning, but the government later downgraded the alert. More than a dozen strong quakes were reported in the Japan Sea, with an initial major tsunami warning for Ishikawa and lower-level warnings for the western coast and Hokkaido. The tsunami warning was eventually downgraded to a regular warning, with the possibility of waves up to 10 feet.',
  // 'A powerful 7.6-magnitude earthquake strikes central Japan\'s western coastline, prompting tsunami alerts and warnings for residents to evacuate. The quake causes power outages and the collapse of buildings in Ishikawa. Tsunami waves reach up to 5 meters in height. Officials urge residents to stay alert and prepare for further quakes.',
];

async function main() {
  const model = await use.load();
  const embeddings = await model.embed(SENTENCES);
  for (let i = 0; i < embeddings.shape[0]; i++) {
    for (let j = i + 1; j < embeddings.shape[0]; j++) {
      const a = tf.slice(embeddings, [i, 0], [1, embeddings.shape[1]]);
      const b = tf.slice(embeddings, [j, 0], [1, embeddings.shape[1]]);
      const score = a.matMul(b.transpose()).arraySync()[0][0];
      console.log(SENTENCES[i], SENTENCES[j], score);
    }
  }
}

await main();