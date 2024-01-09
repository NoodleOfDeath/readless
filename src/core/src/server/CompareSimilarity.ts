import '@tensorflow/tfjs-backend-cpu';

import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export async function compareSimilarity(a: string, b: string, model?: any) {
  const sentences = [a, b];
  if (!model) {
    model = await use.load();
  }
  const embeddings = await model.embed(sentences);
  for (let i = 0; i < embeddings.shape[0]; i++) {
    for (let j = i + 1; j < embeddings.shape[0]; j++) {
      const a = tf.slice(embeddings, [i, 0], [1, embeddings.shape[1]]);
      const b = tf.slice(embeddings, [j, 0], [1, embeddings.shape[1]]);
      const score = a.matMul(b.transpose()).arraySync()[0][0];
      return score;
    }
  }
}