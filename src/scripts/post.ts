#!/usr/bin/env ts-node

import 'dotenv/config';
import { ArgumentParser } from 'argparse';
import axios from 'axios';

const parser = new ArgumentParser({});

parser.add_argument('url');

parser.add_argument('-d', '--dev', { action: 'store_true' });
parser.add_argument('-p', '--prod', { action: 'store_true' });

const args = parser.parse_args();

console.log(args);

let target = 'http://localhost:6970';

if (args.dev) {
  target = 'https://api.dev.readless.ai';
} else if (args.prod) {
  target = 'https://api.readless.ai';
}

async function main() {
  await axios
    .post(
      `${target}/v1/sources`,
      { url: args.url },
      { timeout: 120_000 }
    )
    .then(console.log)
    .catch(console.error);
}

main();
