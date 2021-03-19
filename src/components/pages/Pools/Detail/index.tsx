import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler, FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { FeederPool__factory } from '@mstable/protocol/types/generated';

import type { FeederPoolState } from '../../../../context/DataProvider/types';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { useFeederPool } from '../../../../context/DataProvider/DataProvider';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import {
  useSigner,
  useWalletAddress,
} from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { ViewportWidth } from '../../../../theme';
import { Button } from '../../../core/Button';
import { EtherscanLink } from '../../../core/EtherscanLink';
import { TabSwitch } from '../../../core/Tabs';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { InputV2 as Input } from '../../../forms/AmountInputV2';
import { AssetInput } from '../../../forms/AssetInput';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';

import { assetColorMapping, assetDarkColorMapping } from '../utils';
import { LiquidityChart } from './LiquidityChart';
import { RewardsOverview } from './RewardsOverview';
import type { AddressOption } from '../../../../types';
import { VaultRewardsProvider } from '../../Save/v2/RewardsProvider';
import { SendButton } from '../../../forms/SendButton';
import { Interfaces } from '../../../../types';

const UserLookup = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  p {
    font-weight: 600;
  }

  > button {
    width: 100%;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > button {
      width: inherit;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  margin: 1.5rem 0;
`;

const AssetDetails = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  margin-top: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
  }

  > div a {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
  }

  > div a:not(:last-child) {
    margin-right: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    align-items: center;
    flex-direction: row;

    > h3 {
      font-size: 1.25rem;
      margin-bottom: 0;
    }

    > div a {
      font-size: 1.125rem;
    }

    > div a:not(:last-child) {
      margin-right: 2rem;
    }
  }
`;

const HeaderCard = styled(AssetCard)`
  h2 {
    font-size: 1.75rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }

  > div:last-child {
    overflow: hidden;
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    justify-content: space-between;
    flex-direction: row;

    > div {
      flex: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }

    > div:last-child {
      display: inherit;
      flex-basis: calc(35% - 0.5rem);

      > div {
        height: 100%;
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
`;

const TabContainer = styled.div`
  width: 100%;
  margin-top: 1rem;

  > * {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 50%;
  }
`;

const Withdraw: FC<{
  address: string;
  label: string;
}> = ({ address: poolAddress, label }) => {
  const token = useTokenSubscription(poolAddress);

  const addressOptions: AddressOption[] = token
    ? [
        {
          ...token,
          label,
          custom: true,
        },
      ]
    : [];

  const [address, setAddress] = useState<string | undefined>(poolAddress);

  return (
    <TabContainer>
      <AssetInput
        addressOptions={addressOptions}
        address={address}
        handleSetAddress={setAddress}
      />
      <Button highlighted>Withdraw</Button>
    </TabContainer>
  );
};

const Deposit: FC<{
  poolAddress: string;
  tokens: string[];
}> = ({ poolAddress, tokens }) => {
  const [address, setAddress] = useState<string | undefined>(tokens[0]);
  const [amount, formValue, handleSetAmount] = useBigDecimalInput();

  const propose = usePropose();
  const signer = useSigner();
  const walletAddress = useWalletAddress();

  const token = useTokenSubscription(address);
  const valid = !!(
    address &&
    token?.balance &&
    amount?.exact.lt(token.balance.exact)
  );

  return (
    <TabContainer>
      <AssetInput
        addressOptions={tokens}
        address={address}
        formValue={formValue}
        handleSetAddress={setAddress}
        handleSetAmount={handleSetAmount}
      />
      <SendButton
        title="Deposit"
        valid={valid}
        handleSend={() => {
          // TODO use SaveWrapper to deposit straight to vault
          if (valid && amount && address && walletAddress && signer) {
            propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                FeederPool__factory.connect(poolAddress, signer),
                'mint',
                // FIXME slippage
                [address, amount.exact, '1', walletAddress],
                { past: 'Deposited', present: 'Depositing' },
              ),
            );
          }
        }}
      />
    </TabContainer>
  );
};

const PoolDetailContent: FC<{ poolAddress: string }> = ({ poolAddress }) => {
  const [lookupAddress, setLookupAddress] = useState<string | undefined>();
  const inputText = useRef<string | undefined>();

  const { title, fasset, masset } = useFeederPool(
    poolAddress,
  ) as FeederPoolState;
  useTokenSubscription(poolAddress);
  useTokenSubscription(fasset.address);
  useTokenSubscription(masset.address);

  const color = assetColorMapping[title];
  const darkColor = assetDarkColorMapping[title];

  const tabs = useMemo(
    () => ({
      Deposit: {
        title: 'Deposit',
        component: (
          <Deposit
            poolAddress={poolAddress}
            tokens={[masset.address, fasset.address]}
          />
        ),
      },
      Withdraw: {
        title: 'Withdraw or Exit',
        component: <Withdraw address={poolAddress} label={title} />,
      },
    }),
    [masset.address, fasset.address, poolAddress, title],
  );

  const [activeTab, setActiveTab] = useState<string>('Deposit');

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      inputText.current = event.target.value ?? undefined;
    },
    [],
  );

  const handleLookupClick = useCallback(() => {
    setLookupAddress(inputText.current);
  }, []);

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderContainer>
        <HeaderCard address={poolAddress} isLarge color={color} />
        <LiquidityChart color={darkColor} />
      </HeaderContainer>
      <AssetDetails>
        <h3>Asset Details</h3>
        <div>
          <EtherscanLink data={poolAddress} type="address">
            <h3>{title}</h3>
          </EtherscanLink>
          {[masset.token, fasset.token].map(token =>
            token.address ? (
              <EtherscanLink
                data={token.address}
                type="address"
                key={token.address}
              >
                <p>{token.symbol}</p>
              </EtherscanLink>
            ) : (
              <ThemedSkeleton width={48} height={32} key={token.address} />
            ),
          )}
        </div>
      </AssetDetails>
      <Divider />
      <UserLookup>
        <p>{lookupAddress ? 'Viewing balance of:' : 'Lookup user balance:'}</p>
        <Input
          placeholder="0x00000000000000000000000000000"
          onChange={handleChange}
        />
        <Button onClick={handleLookupClick}>View</Button>
      </UserLookup>
      <RewardsOverview poolAddress={poolAddress} />
      <Divider />
      <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab} />
    </Container>
  );
};

// TODO support more than just feeders
export const PoolDetail: FC = () => {
  const { poolAddress } = useParams<{
    poolAddress: string;
  }>();
  const feederPool = useFeederPool(poolAddress);
  return feederPool ? (
    <VaultRewardsProvider vault={feederPool.vault}>
      <PoolDetailContent poolAddress={poolAddress} />
    </VaultRewardsProvider>
  ) : (
    <Skeleton height={300} />
  );
};
