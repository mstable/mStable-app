/* eslint-disable no-await-in-loop */

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import RenJS from '@renproject/ren';
import { Bitcoin, Ethereum } from '@renproject/chains';
import { retryNTimes } from '@renproject/utils';
import {
  DepositStatus,
  LockAndMint,
} from '@renproject/ren/build/main/lockAndMint';
import { LockAndMintDeposit } from '@renproject/ren/build/module/lockAndMint';
import {
  getRenNetworkDetails,
  LockAndMintParams,
  RenNetwork,
  TxStatus,
} from '@renproject/interfaces';

import {
  useProvider,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { useFetchState } from '../../../../hooks/useFetchState';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AmountInput } from '../../../forms/AmountInput';
import { Button } from '../../../core/Button';
import { ErrorMessage } from '../../../core/ErrorMessage';
import { ProgressBar } from '../../../core/ProgressBar';
import { BigDecimal } from '../../../../web3/BigDecimal';

const StyledProgressBar = styled(ProgressBar)`
  height: 1rem;
`;

const storageKey = 'renBTC.depositTransactions';

interface LockAndMintDepositDetails {
  amount: string;
  transaction: {
    vOut: number;
    confirmations: number;
    amount: number;
    txHash: string;
  };
}

type DepositStorage = { [hash: string]: LockAndMintDepositDetails };

const getDepositStorage = (): DepositStorage => {
  return JSON.parse(localStorage.getItem(storageKey) ?? '{}');
};

const saveToDepositStorage = async (
  deposit: LockAndMintDeposit,
): Promise<void> => {
  const transactions = getDepositStorage();
  const hash = await deposit.txHash();

  if (hash && !transactions[hash]) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...transactions,
        [hash]: deposit.depositDetails,
      }),
    );
  }
};

const removeFromDepositStorage = (hash: string): void => {
  const transactions = getDepositStorage();

  if (hash && transactions[hash]) {
    const { [hash]: _, ...rest } = transactions;
    localStorage.setItem(storageKey, JSON.stringify(rest));
  }
};

const StoredDeposits: FC<{
  setCurrentDeposit(depositDetails: LockAndMintDepositDetails): void;
}> = ({ setCurrentDeposit }) => {
  const [deposits, setDeposits] = useState<LockAndMintDepositDetails[]>([]);

  useEffect(() => {
    const depositStorage = getDepositStorage();
    setDeposits(Object.values(depositStorage));
  }, []);

  return (
    <div>
      {deposits.map(depositDetails => (
        <div key={depositDetails.transaction.txHash}>
          <div>Hash: {depositDetails.transaction.txHash}</div>
          <div>Amount (sats): {depositDetails.amount}</div>
          <div>vOut (index): {depositDetails.transaction.vOut}</div>
          <div>Confirmations: {depositDetails.transaction.confirmations}</div>
          <div>
            <Button
              onClick={() => {
                setCurrentDeposit(depositDetails);
              }}
            >
              Process deposit
            </Button>
            <Button
              onClick={() => {
                removeFromDepositStorage(depositDetails.transaction.txHash);
              }}
            >
              Remove from browser storage
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// TODO use network from env
const renJS = new RenJS(RenNetwork.Testnet, {});

// TODO generalise for withdraw
const RenMintLogic: FC = () => {
  const provider = useProvider();
  const walletAddress = useWalletAddress();

  const [
    btcAmount,
    btcAmountFormValue,
    setBtcAmountFormValue,
  ] = useBigDecimalInput('0', { decimals: 8 });

  const [btcConfs, setBtcConfs] = useState<number>();
  const [btcTarget, setBtcTarget] = useState<number>();
  const [ethHash, setEthHash] = useState<string>();
  const [mint, setMint] = useFetchState<LockAndMint>();
  const [isDepositing, toggleIsDepositing] = useToggle(false);
  const [params, setParams] = useState<LockAndMintParams>();
  const [renError, setRenError] = useState<string>();
  const [renHash, setRenHash] = useState<string>();
  const [renStatus, setRenStatus] = useState<TxStatus>();
  const [currentDeposit, setCurrentDeposit] = useState<LockAndMintDeposit>();
  const [renFees, setRenFees] = useFetchState<{
    lock?: BigDecimal;
    release?: BigDecimal;
    mintBps: number;
    burnBps: number;
  }>();

  const startLockAndMint = useCallback(() => {
    if (params) {
      setMint.fetching();
      renJS
        .lockAndMint(params)
        .then(setMint.value)
        .catch(setMint.error);
    }
  }, [params, setMint]);

  const processDeposit = useCallback(
    async (
      depositOrDetails:
        | LockAndMintDeposit
        | LockAndMintDeposit['depositDetails'],
    ) => {
      toggleIsDepositing(true);

      // Unset all previous state
      setBtcConfs(undefined);
      setBtcTarget(undefined);
      setEthHash(undefined);
      setRenError(undefined);
      setRenHash(undefined);
      setRenStatus(undefined);

      if (!mint.value) {
        return;
      }

      try {
        const retries = -1;
        const timeout = 10e3;

        const deposit = (await (depositOrDetails instanceof LockAndMintDeposit
          ? new Promise(resolve => {
              (mint.value as NonNullable<typeof mint['value']>).on(
                'deposit',
                _deposit => {
                  resolve((_deposit as unknown) as LockAndMintDeposit);
                },
              );
            })
          : mint.value.processDeposit(depositOrDetails))) as LockAndMintDeposit;

        setCurrentDeposit(deposit);

        while (deposit.status !== DepositStatus.Submitted) {
          switch (deposit.status) {
            case DepositStatus.Detected: {
              await retryNTimes(
                async () => {
                  await saveToDepositStorage(deposit);
                  await deposit
                    .confirmed()
                    .on('target', setBtcTarget)
                    .on('confirmation', setBtcConfs);
                },
                retries,
                timeout,
              );
              break;
            }
            case DepositStatus.Confirmed: {
              await retryNTimes(
                () =>
                  deposit
                    .signed()
                    .on('txHash', _renHash => {
                      setRenHash(_renHash);
                      setRenStatus(TxStatus.TxStatusPending);
                    })
                    .on('status', setRenStatus),
                retries,
                timeout,
              );
              break;
            }
            case DepositStatus.Signed: {
              await retryNTimes(
                async () => {
                  try {
                    await deposit.mint().on('transactionHash', setEthHash);
                  } catch (error) {
                    const message = error.message ?? error.toString();
                    if (/execution reverted/.exec(message)) {
                      setRenStatus(TxStatus.TxStatusReverted);
                    }
                    throw error;
                  }
                },
                retries,
                timeout,
              );
              break;
            }
            case DepositStatus.Reverted: {
              setRenError(`Transaction reverted: ${deposit.revertReason}`);
              break;
            }
            default:
              break;
          }
        }
      } catch (error) {
        setRenError(error.message ?? error.toString());
      } finally {
        toggleIsDepositing(false);
      }
    },
    [mint.value, toggleIsDepositing],
  );

  // Set params
  useEffect(() => {
    if (!btcAmount || !provider) return;

    setParams({
      asset: 'BTC',
      from: Bitcoin(),
      to: Ethereum(
        provider._web3Provider as Parameters<typeof Ethereum>[0],
        getRenNetworkDetails(RenNetwork.Testnet), // TODO use env for network
      ).Contract({
        sendTo: '0x60Bb4AbbC2E7c4D958459e733f19d855d19dEE7d', // TODO use constant
        contractFn: 'depositAndMint',
        contractParams: [
          {
            name: '_recipient',
            type: 'address',
            value: walletAddress,
          },
          {
            name: '_minOutputAmount',
            type: 'uint256',
            value: btcAmount.exact.sub(10000), // TODO use slippage
          },
        ],
      }),
    });
  }, [btcAmount, provider, walletAddress]);

  // Set fees (once)
  useEffect(() => {
    if (params && !renFees.value && !renFees.fetching) {
      setRenFees.fetching();
      renJS
        .getFees(params)
        .then(({ lock, mint: mintBps, burn: burnBps, release }) => {
          setRenFees.value({
            lock: lock ? new BigDecimal(lock?.toString(), 8) : undefined,
            release: release
              ? new BigDecimal(release?.toString(), 8)
              : undefined,
            mintBps,
            burnBps,
          });
        })
        .catch(setRenFees.error);
    }
  }, [params, renFees, setRenFees]);

  const restoreDeposit = useCallback(async (txHash: string) => {
    await depositBtc(txHash);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        <StoredDeposits setCurrentDeposit={setCurrentDeposit} />
        <div>Deposit BTC via renBTC</div>
        <AmountInput
          onChange={setBtcAmountFormValue}
          value={btcAmountFormValue}
        />
        <div>
          <div>Ren fees</div>
          <div>
            {renFees.fetching && <Skeleton />}
            {renFees.value?.lock && btcAmount && (
              <>
                <div>Lock BTC: {renFees.value.lock.simple}</div>
                <div>
                  Mint renBTC:{' '}
                  {btcAmount.simple * (renFees.value.mintBps / 1e4)}
                </div>
                <div>
                  Total:{' '}
                  {renFees.value.lock.simple +
                    btcAmount.simple * (renFees.value.mintBps / 1e4)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {mint.value ? (
          <Button highlighted disabled={isDepositing} onClick={depositBtc}>
            Start new deposit
          </Button>
        ) : (
          <Button
            highlighted
            disabled={mint.fetching}
            onClick={startLockAndMint}
          >
            Start mint
          </Button>
        )}
        {isDepositing && (
          <>
            <div>
              <div>Deposit address</div>
              <div>
                {gatewayAddress.fetching && <Skeleton />}
                {gatewayAddress.value ? (
                  <>
                    Deposit {btcAmountFormValue} BTC to this address:{' '}
                    {gatewayAddress.value}
                  </>
                ) : (
                  '–'
                )}
              </div>
            </div>
            <div>
              <div>Bitcoin confirmations</div>
              <div>
                Hash: {currentDeposit?.depositDetails?.transaction?.txHash}
              </div>
              <div>
                <StyledProgressBar
                  decimals={0}
                  hue={38}
                  min={0}
                  max={btcTarget}
                  value={btcConfs}
                />
              </div>
            </div>
            <div>
              <div>Ren status</div>
              <div>renVM hash: {renHash ?? <Skeleton width={200} />}</div>
              <div>{renStatus ?? '–'}</div>
              {renError && <ErrorMessage error={renError} />}
            </div>
            <div>
              <div>Ethereum status</div>
              <div>Hash: {ethHash ?? '–'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const RenMint: FC = () => {
  const massetState = useSelectedMassetState();
  return massetState ? <RenMintLogic /> : <Skeleton />;
};
