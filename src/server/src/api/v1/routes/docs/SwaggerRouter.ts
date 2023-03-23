import fs from 'fs';

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

const swaggerDocument = JSON.parse(fs.readFileSync('swagger.json', { encoding: 'utf8' }));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;