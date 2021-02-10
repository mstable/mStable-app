import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AssetExchange } from '../../../forms/AssetExchange';
import { CollapseBox } from '../../../forms/CollapseBox';
import { PageAction, PageHeader } from '../../PageHeader';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Button } from '../../../core/Button';
import { RenMintOnboard as MintOnboard } from './RenMintOnboard';
import { OnboardData } from './types';

// To index address with
const BTC_ADDRESS = 'BTC_ADDRESS_1';

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

const ExchangeContainer = styled.div`
  width: 66.66%;
  margin-top: 1rem;
`;

export const RenMint: FC = () => {
  // const [outputAddress, handleSetAddress] = useState<string | undefined>();
  const [txDetails, setTxDetails] = useState<OnboardData | undefined>();

  const massetState = useSelectedMassetState();
  const { address: massetAddress } = massetState ?? {};

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const outputAddressOptions = useMemo(() => {
    return [{ address: massetAddress, symbol: massetState?.token.symbol }];
  }, [massetAddress, massetState]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (!inputAmount) return {};

    return { value: inputAmount };
  }, [inputAmount]);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancelClick = useCallback(() => setTxDetails(undefined), []);

  return (
    <div>
      <PageHeader
        action={PageAction.Mint}
        subtitle="Convert stablecoins into mBTC via RenVM"
      />
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
        {txDetails ? (
          <MintOnboard onboardData={txDetails} />
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
                setTxDetails({
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
      </ExchangeContainer>
    </div>
  );
};
