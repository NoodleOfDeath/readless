import 'dotenv/config';
import p from 'path';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { S3Service } from '../src/services/aws';

jest.setTimeout(30_000);

const BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhmVYSWZNTQAqAAAACAAEARoABQAAAAEAAAA+ARsABQAAAAEAAABGATEAAgAAAA4AAABOh2kABAAAAAEAAABcAAAAAAAAAEgAAAABAAAASAAAAAFBcnRzdHVkaW8gUHJvAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAYoAMABAAAAAEAAAAYAAAAAM1KKQMAAAAJcEhZcwAACxMAAAsTAQCanBgAAALRaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BcnRzdHVkaW8gUHJvPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoW6vMCAAABbklEQVRIDe1UzWrCQBic/JkohWhLCioIisFH8Bm82D6Ch75EX6EvUHrpufSee26ec4gXQXM2UUhSIogmzbc0qRGKl0oPzcIm37fZncnMwHIAknRebPAXQ/4CLgnOOlxa9PcWice/MLm7wu2NwJbCKMHL+wc4jgPP86hUKpAkCVEUQRRF7Ha746PY7/eFPmsKBFqDx9Orz749PjTQ7XYxHo8RxzF830ev10OtVoNt22i325jNZmg2m3AcB4ZhZJiFd4Hg9M7YbreYz+cMbLVawfM8tFotbDYbLBYLDIdDLJdLqKrKlCbJKQJQIDimpq3VahVE4roussMEfjgcIAgCI6/X6wx8NBqh0+lgOp3Csqwc6kcCLt1C8geDATRNAynIgMmqIAigKArW6zWr+/0+dF2HaZo5OBWEk+ua3KchX3+H/PwWMPkETJNUUMBUU/gUNCmhjKinIcsywjBkNT0KBPnqLxblVXHWzNKif2DRJ+Adhdmi9xxVAAAAAElFTkSuQmCC';

describe('uploads to the s3 bucket', () => {
  
  let file: string;
  
  test('blob', async () => {
    const file = await S3Service.download(BASE64_IMAGE);
    expect(file).toBeDefined();
    console.log(file);
  });

  test('download file', async () => {
    file = await S3Service.download('https://ca-times.brightspotcdn.com/dims4/default/b9aa17d/2147483647/strip/true/crop/5934x3957+0+0/resize/1200x800!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F1c%2Fe4%2Ff81116cb31124a04a7049a0a36d0%2Fd53d3b0d50604c2691b5c3949e0271dc', { filetype: '' });
    console.log(file);
    expect(true).toBe(true);
  });
  
  test('put file', async () => {
    const response = await S3Service.putObject({
      ContentType: 'audio/mpeg',
      File: file,
      Folder: 'audio/s',
    });
    console.log(response);
    expect(response).toBeDefined();
  });
  
  test('get file', async () => {
    const response = await S3Service.getObject({ Key: `audio/s/${file ? p.basename(file) : 'test.mp3'}` });
    console.log(response);
    expect(response).toBeDefined();
  });

});