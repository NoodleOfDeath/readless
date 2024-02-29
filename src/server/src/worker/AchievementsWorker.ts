
import { Op } from 'sequelize';

import { RequestLog } from '../api/v1/schema';
import { DBService } from '../services';

async function main() {
  await DBService.prepare();
  doWork();
}

export async function doWork() {
  try {
    // OG achievements
    const logs = await RequestLog.findAll({ 
      group: 'userId',
      where: { 
        createdAt: { [Op.lt]: new Date('11/26/2023') }, 
        userId: { [Op.ne]: null }, 
      },
    });
    
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork(), 3_000);
  }
}

main();
