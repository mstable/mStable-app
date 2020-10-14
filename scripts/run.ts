import { main as vaultBreakdown } from './vaultBreakdown';
import { main as platformRewards } from './platformRewards';
import { main as merkleRootHash } from './merkleRootHash';
import { main as feesBreakdown } from './feesBreakdown';

import { runMain } from './utils/runMain';

const script = process.argv[2];

switch (script) {
  case 'platform-rewards':
    runMain(platformRewards);
    break;
  case 'vault-breakdown':
    runMain(vaultBreakdown);
    break;
  case 'merkle-root-hash':
    runMain(merkleRootHash);
    break;
  case 'fees-breakdown':
    runMain(feesBreakdown);
    break;
  default: {
    console.error('Unknown script');
    process.exit(0);
  }
}
