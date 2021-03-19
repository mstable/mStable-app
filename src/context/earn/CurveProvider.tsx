import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { parse, LosslessNumber } from 'lossless-json';
import { DeepPartial } from 'utility-types';

import {
  CurveDeposit__factory,
  GaugeController__factory,
  MusdGauge__factory,
  StableSwap__factory,
  StakingRewards__factory,
  TokenMinter__factory,
  CurveDeposit,
  GaugeController,
  MusdGauge,
  StableSwap,
  StakingRewards,
  TokenMinter,
} from '../../typechain';
import { useSignerOrInfuraProvider } from '../OnboardProvider';
import { useBlockNow } from '../BlockProvider';
import { useAccount } from '../UserProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { CHAIN_ID, ADDRESSES } from '../../constants';

export const CURVE_MUSD_EARN_URL = '/earn/curve-musd-3pool';

export interface CurveContracts {
  mtaStakingRewards?: StakingRewards;
  gaugeController?: GaugeController;
  musdDeposit?: CurveDeposit;
  musdGauge?: MusdGauge;
  musdSwap?: StableSwap;
  tokenMinter?: TokenMinter;
}

export interface CurveBalances {
  claimableMTA?: BigDecimal;
  claimableCRV?: BigDecimal;
  stakingBalance?: BigDecimal;
}

export interface CurveJsonData {
  yieldApy: LosslessNumber;
  stats: DeepPartial<{
    A: LosslessNumber;
    fee: LosslessNumber;
    admin_fee: LosslessNumber;
    supply: LosslessNumber;
    virtual_price: LosslessNumber;
    timestamp: LosslessNumber;
    balances: [LosslessNumber, LosslessNumber];
    rates: [LosslessNumber, LosslessNumber];
    underlying_rate: LosslessNumber;
    volume: {
      '0-2': [LosslessNumber, LosslessNumber];
      '0-3': [LosslessNumber, LosslessNumber];
    };
    prices: {
      '0-2': [LosslessNumber, LosslessNumber, LosslessNumber, LosslessNumber];
      '0-3': [LosslessNumber, LosslessNumber, LosslessNumber, LosslessNumber];
    };
  }>;
}

const contractsCtx = createContext<CurveContracts>({});
const balancesCtx = createContext<CurveBalances>({});
const jsonDataCtx = createContext<CurveJsonData | undefined>(undefined);

export const useCurveContracts = (): CurveContracts => useContext(contractsCtx);

export const useCurveJsonData = (): CurveJsonData | undefined =>
  useContext(jsonDataCtx);

export const useCurveBalances = (): CurveBalances => useContext(balancesCtx);

const CurveContractsProvider: FC = ({ children }) => {
  const provider = useSignerOrInfuraProvider();

  const contracts = useMemo<CurveContracts>(() => {
    if (CHAIN_ID === 1) {
      return {
        mtaStakingRewards: StakingRewards__factory.connect(
          ADDRESSES.CURVE.MTA_STAKING_REWARDS,
          provider,
        ),
        gaugeController: GaugeController__factory.connect(
          ADDRESSES.CURVE.GAUGE_CONTROLLER,
          provider,
        ),
        tokenMinter: TokenMinter__factory.connect(
          ADDRESSES.CURVE.TOKEN_MINTER,
          provider,
        ),
        musdDeposit: CurveDeposit__factory.connect(
          ADDRESSES.CURVE.MUSD_DEPOSIT,
          provider,
        ),
        musdGauge: MusdGauge__factory.connect(
          ADDRESSES.CURVE.MUSD_GAUGE,
          provider,
        ),
        musdSwap: StableSwap__factory.connect(
          ADDRESSES.CURVE.MUSD_SWAP,
          provider,
        ),
      };
    }
    return {};
  }, [provider]);

  return (
    <contractsCtx.Provider value={contracts}>{children}</contractsCtx.Provider>
  );
};

const CurveBalancesProvider: FC = ({ children }) => {
  const account = useAccount();
  const blockNumber = useBlockNow();
  const [balances, setBalances] = useState<CurveBalances>({});
  const { musdGauge } = useCurveContracts();

  useEffect(() => {
    if (account && musdGauge) {
      Promise.all([
        musdGauge.claimed_rewards_for(account),
        musdGauge.claimable_reward(account),
        musdGauge.claimable_tokens(account),
        musdGauge.balanceOf(account),
        musdGauge.rewards_for(account),
      ]).then(([claimedReward, claimableReward, claimableCRV, balance]) => {
        setBalances({
          claimableMTA: new BigDecimal(claimableReward.sub(claimedReward), 18),
          claimableCRV: new BigDecimal(claimableCRV, 18),
          stakingBalance: new BigDecimal(balance, 18),
        });
      });
      return;
    }

    setBalances({});
    // eslint-disable-next-line
  }, [blockNumber, account]);

  return (
    <balancesCtx.Provider value={balances}>{children}</balancesCtx.Provider>
  );
};

const CurveJsonDataProvider: FC = ({ children }) => {
  const [jsonData, setJsonData] = useState<CurveJsonData>();

  useEffect(() => {
    Promise.all([
      fetch('https://stats.curve.fi/raw-stats/apys.json'),
      fetch('https://stats.curve.fi/raw-stats/musd-1440m.json'),
    ])
      .then(([apyRes, statsRes]) => {
        Promise.all([apyRes.text(), statsRes.text()]).then(([_apy, _stats]) => {
          const apyJson = parse(_apy);
          const statsJson: CurveJsonData['stats'][] = parse(_stats);
          const yieldApy = apyJson.apy.day.musd;

          // Find last valid entry
          const validStats = statsJson.filter(
            item =>
              item &&
              item.prices?.['0-2'] &&
              item.balances?.[0] &&
              item.balances[1],
          );
          const stats =
            validStats.length > 1
              ? validStats[validStats.length - 1]
              : validStats[0];

          setJsonData({ yieldApy, stats });
        });
      })
      .catch(error => {
        console.error(`Error retrieving Curve data`, error);
      });
  }, [setJsonData]);

  return (
    <jsonDataCtx.Provider value={jsonData}>{children}</jsonDataCtx.Provider>
  );
};

export const CurveProvider: FC = ({ children }) => {
  return (
    <CurveContractsProvider>
      <CurveBalancesProvider>
        <CurveJsonDataProvider>{children}</CurveJsonDataProvider>
      </CurveBalancesProvider>
    </CurveContractsProvider>
  );
};
