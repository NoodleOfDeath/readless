import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import p from 'path';

type AudioEditorOptions = {
  watchDir: string;
  outputDir: string;
  namingSchema: (name: string, index: number) => string;
};

type AudioEditOptions = {
  overwrite: boolean;
  outputName: string;
  outputPath: string;
  clip: string | { start?: string; end?: string };
};

function ffprobeSync(path: string): Promise<ffmpeg.FfprobeData> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata);
    });
  });
}

function resolveOutputPath(
  path: string,
  outputName?: string,
  outputDir?: string,
  overwrite = false,
  ext = p.parse(path).ext || '.wav',
  count = 0
) {
  const prefix = p.basename(outputName || path, ext);
  const suffix = count > 0 ? `-${count}` : '';
  const newPath = p.join(
    outputDir || p.dirname(path),
    [prefix, suffix, ext].join('')
  );
  if (fs.existsSync(newPath) && !overwrite) {
    return resolveOutputPath(
      path,
      outputName,
      outputDir,
      overwrite,
      ext,
      count + 1
    );
  }
  return newPath;
}

export class AudioEditingService {
  watchDir: string;
  outputDir: string;

  get batchCount(): number {
    return fs.existsSync('.batch')
      ? parseInt(fs.readFileSync('.batch', { encoding: 'utf-8' }).toString())
      : 0;
  }
  set batchCount(count: number) {
    fs.writeFileSync('.batch', count.toString(), { encoding: 'utf-8' });
  }

  namingSchema: (name: string, index: number) => string;

  constructor({
    watchDir = p.resolve(process.env.BATCH_DIR),
    outputDir = p.resolve(process.env.OUTPUT_DIR),
    namingSchema = (name: string, index: number) =>
      `Batch ${this.batchCount} - ${index}`,
  }: Partial<AudioEditorOptions> = {}) {
    this.watchDir = watchDir;
    this.outputDir = outputDir;
    this.namingSchema = namingSchema;
    if (!watchDir) {
      fs.mkdirSync(watchDir, { recursive: true });
    }
    if (!outputDir) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  incrementBatchCount() {
    this.batchCount++;
  }

  async edit(
    path: string,
    {
      overwrite = false,
      outputName,
      outputPath = resolveOutputPath(
        path,
        outputName,
        this.outputDir,
        overwrite
      ),
      clip,
    }: Partial<AudioEditOptions> = {}
  ): Promise<string> {
    try {
      const opts: string[] = [];
      if (typeof clip === 'string') {
        opts.push(`-t ${clip}`);
      } else {
        const metadata = await ffprobeSync(path);
        if (clip?.start) {
          opts.push(`-ss ${clip.start}`);
        }
        if (clip?.end) {
          const duration = metadata.format.duration;
          const end = clip.end;
          const endSeconds = end.endsWith('s')
            ? parseFloat(end.slice(0, -1))
            : parseFloat(end);
          const endOffset =
            endSeconds > duration ? duration : duration - endSeconds;
          opts.push(`-t ${endOffset}s`);
        }
      }
      ffmpeg(path).inputOptions(opts.join(' ')).output(outputPath).run();
      return outputPath;
    } catch (e) {
      console.error(e);
    }
  }

  async merge(opts: Partial<AudioEditOptions> = {}, ...paths: string[]) {
    try {
      if (paths.length < 2) {
        throw new Error('Must provide at least two paths to merge');
      }
      const path = paths.shift();
      const outputPath =
        opts.outputPath ??
        resolveOutputPath(
          path,
          opts.outputName,
          this.outputDir,
          opts.overwrite
        );
      let fd = ffmpeg(path);
      for (const input of paths) {
        fd = fd.addInput(input);
      }
      fd.mergeToFile(outputPath, process.env.TMP_DIR);
      return outputPath;
    } catch (e) {
      console.error(e);
    }
  }

  async batchEdit(
    dir: string,
    opts: Partial<AudioEditOptions> = {}
  ): Promise<string[]> {
    this.incrementBatchCount();
    const files = fs
      .readdirSync(dir)
      .map((f) => {
        const stats = fs.statSync(p.join(dir, f));
        return {
          path: p.join(dir, f),
          stats,
        };
      })
      .sort((a, b) => a.stats.mtimeMs - b.stats.mtimeMs);
    try {
      const outfiles = await Promise.all(
        files.map((f, i) =>
          this.edit(f.path, {
            ...opts,
            outputName: this.namingSchema(f.path, i),
          })
        )
      );
      return outfiles;
    } catch (e) {
      console.error(e);
    }
  }
}
