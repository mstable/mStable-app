import { main as vaultBreakdown } from './vaultBreakdown';
import { main as platformRewards } from './platformRewards';

import { runMain } from './utils/runMain';

const script = process.argv[2];

switch (script) {
  case 'platform-rewards':
    runMain(platformRewards);
    break;
  case 'vault-breakdown':
    runMain(vaultBreakdown);
    break;
  default: {
    console.error('Unknown script');
    process.exit(0);
  }
}
