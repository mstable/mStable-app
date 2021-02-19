import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

import { AssetExchange } from '../../../forms/AssetExchange';
import { CollapseBox } from '../../../forms/CollapseBox';
import { PageAction, PageHeader } from '../../PageHeader';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Button } from '../../../core/Button';
import { RenMintOnboard as MintOnboard } from './RenMintOnboard';
import { MassetPage } from '../../MassetPage';
import { getBlockchairLink, getEtherscanLink } from '../../../../utils/strings';
import { ExternalLink } from '../../../core/ExternalLink';
import { ActivitySpinner } from '../../../core/ActivitySpinner';
import { useRenState } from '../../../../context/RenProvider';
import { RenMintProvider, useRenMintOnboardData } from './RenMintProvider';
import { ViewportWidth } from '../../../../theme';

// To index address with
const BTC_ADDRESS = 'BTC_ADDRESS_1';

const Pending = styled.div`
  display: flex;

  div {
    margin-left: 0.5rem;
  }
`;

const TransactionStatus = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  > div {
    display: flex;
  }

  > div:first-child {
    margin-bottom: 0.5rem;

    > *:not(:first-child) {
      margin-left: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    > div:first-child {
      margin-bottom: 0;
    }
  }
`;

const StyledTransactionRow = styled.div<{ complete?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.color.backgroundAccent};
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  opacity: ${({ complete }) => (complete ? 0.75 : 1)};

  h3 {
    font-weight: 600;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  > div {
    display: flex;
    justify-content: space-between;
  }

  > div:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: center;

    h3 {
      display: none;
    }

    > div:not(:last-child) {
      flex-basis: 25%;
      margin-bottom: 0;
    }

    > div:last-child {
      flex-basis: 50%;
    }
  }
`;

const TransactionRow: FC<{
  date: number;
  amount: string;
  etherscanTx?: string;
  bitcoinTx?: string;
}> = ({ date, amount, etherscanTx, bitcoinTx }) => {
  const formattedTime = formatDistanceToNow(date, { addSuffix: true });
  const formattedAmount = amount;
  const etherscanUrl =
    etherscanTx && getEtherscanLink(etherscanTx, 'transaction');
  const bitcoinUrl = bitcoinTx && getBlockchairLink(bitcoinTx, 'transaction');

  const pastActiveThreshold = (Date.now() - date) / 86400000 > 1;
  const expiredWithNoDeposit = pastActiveThreshold && !bitcoinTx;

  return (
    <StyledTransactionRow complete={pastActiveThreshold}>
      <div>
        <h3>Date:</h3>
        <p>{expiredWithNoDeposit ? `Expired` : formattedTime}</p>
      </div>
      <div>
        <h3>Action:</h3>
        <p>
          Mint <span>{formattedAmount}</span> mBTC
        </p>
      </div>
      {!expiredWithNoDeposit && (bitcoinUrl || etherscanUrl) && (
        <div>
          <h3>Transaction:</h3>
          <TransactionStatus>
            <div>
              {!expiredWithNoDeposit && bitcoinUrl ? (
                <ExternalLink href={bitcoinUrl}>BTC TX</ExternalLink>
              ) : (
                !expiredWithNoDeposit && (
                  <Pending>
                    BTC TX <ActivitySpinner size={12} pending />
                  </Pending>
                )
              )}
              {!expiredWithNoDeposit && etherscanUrl ? (
                <ExternalLink href={etherscanUrl}>ETH TX</ExternalLink>
              ) : (
                !expiredWithNoDeposit && (
                  <Pending>
                    ETH TX <ActivitySpinner size={12} pending />
                  </Pending>
                )
              )}
            </div>
            <div>
              {!pastActiveThreshold && (
                <Button highlighted scale={0.875} onClick={() => {}}>
                  Resume
                </Button>
              )}
            </div>
          </TransactionStatus>
        </div>
      )}
    </StyledTransactionRow>
  );
};

const List = styled.ol`
  list-style: circle;
  padding: 0.75rem 1.25rem 0.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.accent};
`;

const Exchange = styled(AssetExchange)`
  > button {
    width: 100%;
  }
`;

const TransactionHeader = styled.div`
  padding: 0 1rem;
  margin-bottom: 0.5rem;

  > div:last-child {
    display: none;
  }

  h3 {
    font-weight: 600;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div:first-child {
      display: none;
    }

    > div:last-child {
      display: flex;
      font-size: 0.875rem;

      > *:not(:last-child) {
        flex-basis: 25%;
      }
      > *:last-child {
        flex-basis: 50%;
      }
    }
  }
`;

const Transactions = styled.div`
  margin-top: 1.5rem;

  > div {
    margin-top: 0.5rem;
  }
`;

const ExchangeContainer = styled.div`
  margin-top: 1rem;
`;

const RenMintContent: FC = () => {
  const [onboardData, setOnboardData] = useRenMintOnboardData();
  const massetState = useSelectedMassetState();
  const [_, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const { storage } = useRenState();

  const { address: massetAddress } = massetState ?? {};

  const pastTransactions = useMemo(() => {
    return Object.keys(storage).map(id => storage[id]);
  }, [storage]);

  const outputAddressOptions = useMemo(() => {
    return [{ address: massetAddress, symbol: massetState?.token.symbol }];
  }, [massetAddress, massetState]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    return { value: new BigDecimal((1e18).toString()) };
  }, []);

  const inputAddress = BTC_ADDRESS;
  const outputAddress = massetAddress;

  const inputAddressOptions = [
    {
      address: inputAddress,
      label: 'BTC',
      symbol: 'BTC',
      custom: true,
    },
  ];

  return (
    <div>
      <PageHeader
        action={PageAction.Mint}
        subtitle="Convert stablecoins into mBTC via RenVM"
      />
      <MassetPage>
        <CollapseBox title="Please use small amounts and use with caution. Loss of funds can occur.">
          <List>
            <li>
              BTC will be deposited to the RenJS BTC gateway (this step can take
              up to 24 hours)
            </li>
            <li>Ren will lock this BTC and mint renBTC.</li>
            <li>
              You will then need to finalize the transaction with an Ethereum
              transaction.
            </li>
            <li>You will receive mBTC</li>
          </List>
        </CollapseBox>
        <ExchangeContainer>
          {onboardData ? (
            <MintOnboard />
          ) : (
            <Exchange
              inputAddressOptions={inputAddressOptions}
              outputAddressOptions={outputAddressOptions}
              inputAddress={inputAddress}
              inputFormValue={inputFormValue}
              exchangeRate={exchangeRate}
              handleSetInputAmount={setInputFormValue}
              outputAddress={outputAddress}
              inputAddressDisabled
            >
              <Button
                highlighted
                onClick={() =>
                  setOnboardData({
                    inputAddress,
                    inputFormValue,
                    inputAddressOptions,
                    outputAddress,
                    outputAddressOptions,
                  })
                }
              >
                Swap
              </Button>
            </Exchange>
          )}
          {pastTransactions.length !== 0 && (
            <Transactions>
              <TransactionHeader>
                <div>
                  <h3>Transaction History</h3>
                </div>
                <div>
                  <h3>Date</h3>
                  <h3>Action</h3>
                  <h3>Transaction</h3>
                </div>
              </TransactionHeader>
              {pastTransactions.map(({ createdAt, depositDetails }) => {
                return (
                  <TransactionRow
                    date={createdAt}
                    amount={depositDetails.amount}
                    bitcoinTx={depositDetails.transaction.txHash}
                    // etherscanTx={etherscanTx}
                  />
                );
              })}
            </Transactions>
          )}
        </ExchangeContainer>
      </MassetPage>
    </div>
  );
};

export const RenMint: FC = () => (
  <RenMintProvider>
    <RenMintContent />
  </RenMintProvider>
);
