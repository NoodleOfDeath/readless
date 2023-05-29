#!/usr/bin/env ts-node

import fs from 'fs';

import { ArgumentParser } from 'argparse';

type TargetType = 'phone' | 'tablet';
type Dimensions = {
  width: number;
  height: number;
};

class Target {

  type: TargetType;
  dimensions: Dimensions;
  
  constructor(type: TargetType, dimensions: Dimensions) {
    this.type = type;
    this.dimensions = dimensions;
  }
  
}

export const TARGETS: Target[] = Object.values({
  ipad129: new Target('tablet', {
    height: 2048,
    width: 2732,
  }),
  iphone55: new Target('phone', {
    height: 2208,
    width: 1242,
  }),
  iphone65: new Target('phone', {
    height: 2778,
    width: 1284,
  }),
});

function main() {

  const parser = new ArgumentParser({});
  
  parser.add_argument('src');
  
  parser.add_argument('-v', '--verbose', { action: 'store_true' });
  parser.add_argument('-o', '--output-directory');
  
  const args = parser.parse_args();
  
  console.log(args);
  
  const sources = fs.readdirSync(args.src);
  
  for (const source of sources) {
    console.log(source);
  }

}

main();

