#!/usr/bin/env ts-node

import fs from 'fs';

import { parse } from 'node-html-parser';

const news = fs.readFileSync('./news.xml', 'utf8');
const document = parse(news);

const locs = [...document.querySelectorAll('loc')].map((e) => e.textContent);
console.log(locs);

console.log(document);
