#!/usr/bin/env ts-node

import fs from "fs";
import { JSDOM } from "jsdom";

const news = fs.readFileSync("./news.xml", "utf8");
const { document } = new JSDOM(news, { contentType: "text/xml" }).window;

const locs = [...document.querySelectorAll("loc")].map((e) => e.textContent);
console.log(locs);

console.log(document);
