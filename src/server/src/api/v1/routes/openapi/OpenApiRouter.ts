import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../../../../../swagger.json' assert { type: 'json' };

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;