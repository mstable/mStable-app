import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { AssetExchange } from '../../../forms/AssetExchange';
import { CollapseBox } from '../../../forms/CollapseBox';
import { PageAction, PageHeader } from '../../PageHeader';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

// To index address with
const BTC_ADDRESS = 'BTC_ADDRESS_1';

const List = styled.ol`
  list-style: circle;
  padding: 0.75rem 1.25rem 0.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.accent};
`;

const Exchange = styled.div`
  width: 50%;
  margin-top: 1rem;
`;

export const RenMint: FC = () => {
  // const [outputAddress, handleSetAddress] = useState<string | undefined>();

  const massetState = useSelectedMassetState();
  const { address: massetAddress } = massetState ?? {};

  const outputAddressOptions = useMemo(() => {
    return [{ address: massetAddress }];
  }, [massetAddress]);

  // const [
  //   inputAmount,
  //   inputFormValue,
  //   setInputFormValue,
  //   setInputAmount,
  // ] = useBigDecimalInput();

  // const inputAddressOptions = useMemo(() => {
  //   return [{ address: saveAddress as string }];
  // }, [saveAddress]);

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
      <Exchange>
        <AssetExchange
          inputAddressOptions={[
            {
              address: BTC_ADDRESS,
              label: 'BTC',
              custom: true,
            },
          ]}
          outputAddressOptions={outputAddressOptions}
          inputAddress={BTC_ADDRESS}
          // inputFormValue={inputFormValue}
          // exchangeRate={exchangeRate}
          // handleSetInputAmount={setInputFormValue}
          // handleSetInputMax={(): void => {
          //   if (inputToken) {
          //     setInputFormValue(inputToken.balance.string);
          //   }
          // }}
          outputAddress={outputAddressOptions[0].address}
          // error={error}
          inputAddressDisabled
        />
      </Exchange>
    </div>
  );
};
