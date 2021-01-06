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

import { StakingRewardsFactory } from '../../typechain/StakingRewardsFactory';
import { GaugeControllerFactory } from '../../typechain/GaugeControllerFactory';
import { MusdGaugeFactory } from '../../typechain/MusdGaugeFactory';
import { StableSwapFactory } from '../../typechain/StableSwapFactory';
import { TokenMinterFactory } from '../../typechain/TokenMinterFactory';
import { CurveDepositFactory } from '../../typechain/CurveDepositFactory';
import { StakingRewards } from '../../typechain/StakingRewards.d';
import { GaugeController } from '../../typechain/GaugeController.d';
import { MusdGauge } from '../../typechain/MusdGauge.d';
import { StableSwap } from '../../typechain/StableSwap.d';
import { TokenMinter } from '../../typechain/TokenMinter.d';
import { CurveDeposit } from '../../typechain/CurveDeposit.d';
import { useSignerOrInfuraProvider } from '../OnboardProvider';
import { useBlockNumber } from '../BlockProvider';
import { useAccount } from '../UserProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { CHAIN_ID } from '../../constants';

export const CURVE_ADDRESSES = {
  CURVE_V2: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
  GAUGE_CONTROLLER: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',

  CRV_TOKEN: '0xd533a949740bb3306d119cc777fa900ba034cd52',
  MUSD_TOKEN: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
  '3POOL_TOKEN': '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
  '3POOL_COINS': [
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  ],

  MTA_STAKING_REWARDS: '0xe6e6e25efda5f69687aa9914f8d750c523a1d261',

  TOKEN_MINTER: '0xd061d61a4d941c39e5453435b6345dc261c2fce0',

  MUSD_LP_TOKEN: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
  MUSD_DEPOSIT: '0x78cf256256c8089d68cde634cf7cdefb39286470',
  MUSD_GAUGE: '0x5f626c30ec1215f4edcc9982265e8b1f411d1352',
  MUSD_SWAP: '0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6',
  '3POOL_SWAP': '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
};

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
        mtaStakingRewards: StakingRewardsFactory.connect(
          CURVE_ADDRESSES.MTA_STAKING_REWARDS,
          provider,
        ),
        gaugeController: GaugeControllerFactory.connect(
          CURVE_ADDRESSES.GAUGE_CONTROLLER,
          provider,
        ),
        tokenMinter: TokenMinterFactory.connect(
          CURVE_ADDRESSES.TOKEN_MINTER,
          provider,
        ),
        musdDeposit: CurveDepositFactory.connect(
          CURVE_ADDRESSES.MUSD_DEPOSIT,
          provider,
        ),
        musdGauge: MusdGaugeFactory.connect(
          CURVE_ADDRESSES.MUSD_GAUGE,
          provider,
        ),
        musdSwap: StableSwapFactory.connect(
          CURVE_ADDRESSES.MUSD_SWAP,
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
  const blockNumber = useBlockNumber();
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
      fetch('https://www.curve.fi/raw-stats/apys.json'),
      fetch('https://www.curve.fi/raw-stats/musd-1440m.json'),
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
