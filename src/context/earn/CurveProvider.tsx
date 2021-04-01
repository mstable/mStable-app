import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

const contractsCtx = createContext<CurveContracts>({});
const balancesCtx = createContext<CurveBalances>({});

export const useCurveContracts = (): CurveContracts => useContext(contractsCtx);

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

export const CurveProvider: FC = ({ children }) => {
  return (
    <CurveContractsProvider>
      <CurveBalancesProvider>{children}</CurveBalancesProvider>
    </CurveContractsProvider>
  );
};
