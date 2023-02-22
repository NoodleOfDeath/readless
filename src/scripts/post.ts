#!/usr/bin/env ts-node

import "dotenv/config";
import { ArgumentParser } from "argparse";
import fetch from "node-fetch";

const parser = new ArgumentParser({});

parser.add_argument("url", { nargs: "+" });

const args = parser.parse_args();

async function main() {
  await fetch("http://localhost:6970/v1/scrape", {
    method: "POST",
    body: JSON.stringify({
      urls: args.url,
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
