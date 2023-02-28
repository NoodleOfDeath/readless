import { AutomationService, DBService } from '../services';

async function main() {
  await DBService.init();
  AutomationService.init();
}

main();