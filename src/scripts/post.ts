#!/usr/bin/env ts-node

import "dotenv/config";
import { ArgumentParser } from "argparse";
import fetch from "node-fetch";

const parser = new ArgumentParser({});

parser.add_argument("url");

parser.add_argument("-d", "--dev", { action: "store_true" });
parser.add_argument("-p", "--prod", { action: "store_true" });

const args = parser.parse_args();

let target = "http://localhost:6970";

if (args.dev) {
  target = "https://api.dev.theskoop.ai";
} else if (args.prod) {
  target = "https://api.theskoop.ai";
}

async function main() {
  await fetch(`${target}/v1/sources`, {
    method: "POST",
    body: JSON.stringify({
      url: args.url,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then(console.log)
    .catch(console.error);
}

main();
