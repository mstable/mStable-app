/**
 * Prerequisites:
 *
 * - Run the `platform-rewards` script for the tranche/token so that the
 *   relevant JSON file exists in the reports directory.
 *
 * Example usage:
 *
 * yarn run merkle-root-hash --trancheNumber=11 \
 * --token=0xba100000625a3754423978a60c9317c58a424e3d
 *
 * Example output:
 *
 * Token: 0xba100000625a3754423978a60c9317c58a424e3d
 * Tranche: 2
 * Total rewards: 13406.953927947931623124
 *
 */

import { options } from 'yargs';
import fs from 'fs';
import { BigNumber, utils } from 'ethers';
import { soliditySha3 } from 'web3-utils';

import { MerkleTree } from '../src/web3/MerkleTree';

interface Allocations {
  [address: string]: BigNumber;
}

const { formatUnits, parseUnits } = utils;

const getAllocations = async (
  trancheNumber: number,
  token: string,
): Promise<Allocations> => {
  let report;
  let reportPath = `./public/reports/tranches/${trancheNumber}/${token}.json`;
  let reportData: string;
  try {
    reportData = ((await fs.promises.readFile(
      reportPath,
    )) as unknown) as string;
  } catch (error) {
    throw new Error(`Report not found: ${reportPath}\n${error}`);
  }
  try {
    report = JSON.parse(reportData) as Record<string, string>;
  } catch (error) {
    throw new Error('Unable to parse report JSON');
  }

  return Object.fromEntries(
    Object.entries(report).map(([account, amount]) => [
      account,
      parseUnits(amount, 18), // Assuming 18 decimals
    ]),
  );
};

export const getMerkleRootHash = async (
  trancheNumber: number,
  token: string,
) => {
  const allocations = await getAllocations(trancheNumber, token);

  const elements = Object.entries(allocations).map(([account, amount]) =>
    soliditySha3(account, amount.toString()),
  ) as string[];

  const merkleTree = new MerkleTree(elements);

  const rootHash = merkleTree.hexRoot;

  const accounts = Object.keys(allocations).length;

  const totalAllocation = Object.values(allocations).reduce(
    (prev, current) => prev.add(current),
    BigNumber.from(0),
  );

  const output = {
    rootHash,
    trancheNumber,
    accounts,
    token,
    totalAllocation: {
      exact: totalAllocation.toString(),
      simple: formatUnits(totalAllocation, 18),
    },
  };

  console.log(JSON.stringify(output, null, 2));
};

export const main = async () => {
  const { argv } = options({
    token: { type: 'string', demandOption: true },
    trancheNumber: { type: 'number', demandOption: true },
  });

  const token = argv.token.toLowerCase();
  const { trancheNumber } = argv;

  await getMerkleRootHash(trancheNumber, token);
};
