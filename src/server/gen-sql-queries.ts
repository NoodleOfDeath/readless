import fs from 'fs';
import p from 'path';

import glob from 'glob';

const OUTPUT_FILE = 'src/api/v1/schema/views.ts';

glob('src/**/*view.sql', (error, queries) => {
  const dict: { [key in string]: string } = {};
  for (const query of queries) {
    const file = p.basename(query).replace(/\.sql$/, '').toUpperCase();
    const contents = fs.readFileSync(query, { encoding: 'utf8' }).replace(/\n+/g, '\n');
    dict[file] = contents;
  }
  console.log(dict);
  fs.writeFileSync(
    OUTPUT_FILE, 
    `
export const VIEWS = ${JSON.stringify(dict, null, 2)};
`
  );
});

