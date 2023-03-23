import fs from 'fs';
import p from 'path';
import { fileURLToPath } from 'url';

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

const __dirname = p.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = JSON.parse(fs.readFileSync(p.resolve(__dirname, '../../../../../swagger.json'), { encoding: 'utf8' }));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;