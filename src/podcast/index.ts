import "dotenv/config";
import fs from "fs";
import p from "path";

import { AudioEditingService } from "./src/tools/audio";

const BATCH_DIR = process.env.BATCH_DIR as string;

async function main() {
  const editor = new AudioEditingService();
  await editor.batchEdit(p.resolve(BATCH_DIR), {
    clip: { end: "0.5s" },
  });
  async function merge() {
    if (
      fs.readdirSync(process.env.OUTPUT_DIR as string).length <
      fs.readdirSync(BATCH_DIR).length
    )
      return;
    clearInterval(interval);
    const outfiles = fs
      .readdirSync(process.env.OUTPUT_DIR as string)
      .map((f) => p.resolve(process.env.OUTPUT_DIR as string, f))
      .sort(
        (a, b) =>
          Number(/(\d+).mp3$/.exec(a)![1] ?? 0) -
          Number(/(\d+).mp3$/.exec(b)![1] ?? 0)
      );
    await editor.merge({ outputPath: p.resolve("./ep3.mp3") }, ...outfiles);
  }
  const interval = setInterval(merge, 1000);
}

main();
