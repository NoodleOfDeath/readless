import sharp from 'sharp';

import { Summary, SummaryMedia } from '../api/v1/schema/models';
import { SummaryMediaAttributes } from '../api/v1/schema/types';
import { DBService, S3Service } from '../services';

export async function main() {
  await DBService.prepare();
  doWork();
}

class Size {

  name: string;
  value: number;
  
  static xs = new Size('xs', 60);
  static sm = new Size('sm', 120);
  static md = new Size('md', 240);
  static lg = new Size('lg', 360);
  static xl = new Size('xl', 480);
  static xxl = new Size('xxl', 720);
  static xxxl = new Size('xxxl', 1920);
  
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
  
}

type DownsampleOptions = Pick<SummaryMediaAttributes, 'key' | 'parentId' | 'path'> & {
  sizes?: Size[];
};

async function downsampleImage({
  key,
  parentId,
  path,
  sizes = [Size.xs, Size.sm, Size.md, Size.lg],
}: DownsampleOptions, folder: string) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<SummaryMedia[]>(async (resolve, reject) => {
    const file = await S3Service.getObject({ Key: path });
    if (!file) {
      reject('Missing file');
      return;
    }
    const results: SummaryMedia[] = [];
    for (const [index, size] of sizes.entries()) {
      const subkey = `${key}@${size.name}`;
      const media = await SummaryMedia.findOne({
        where: {
          key: subkey,
          parentId,
        },
      });
      if (media) {
        console.log('media already exists');
        results.push(media);
        if (index + 1 === sizes.length) {
          resolve(results);
          return;
        }
        continue;
      }
      const target = file.replace(/(\.\w+)$/, (_, $1) => `@${size.name}${$1}`);
      sharp(file)
        .resize(size.value)
        .jpeg()
        .toFile(target, async (err) => {
          if (err) {
            reject(err);
            return;
          }
          const response = await S3Service.putObject({
            ACL: 'public-read',
            Accept: 'image',
            File: target,
            Folder: folder,
          });
          const media = await SummaryMedia.create({
            key: subkey,
            parentId,
            path: response.key,
            type: 'image',
            url: response.url,
          });
          results.push(media);
          if (index + 1 === sizes.length) {
            resolve(results);
          }
        });
    }
  });
}

export async function doWork() {
  console.log('fetching objects');
  try {
    const items = await S3Service.listObjects();
    console.log(items.length);
    for (const item of items) {
      if (/^img\/s/.test(item)) {
        const media = await SummaryMedia.findOne({ where: { path: item } });
        if (!media) {
          console.log('Unlinking dangling media', item);
          try {
            await S3Service.deleteObject({ Key: item });
          } catch (e) {
            console.error(e);
          }
        } else
        if (!/@(?:xs|sm|md|lg|x+l)\.\w+$/.test(item)) {
          console.log('Downsampling', item);
          const folders = item.split('/');
          folders.pop();
          try {
            await downsampleImage(media, folders.join('/'));
            try {
              await Summary.refreshViews();
            } catch (e) {
              console.error(e);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(doWork, 3_000);
  }
}

main();