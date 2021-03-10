import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useTokens } from '../../../../context/TokensProvider';
import { ViewportWidth } from '../../../../theme';
import { SubscribedToken } from '../../../../types';
import { Button } from '../../../core/Button';
import { EtherscanLink } from '../../../core/EtherscanLink';
import { TabSwitch } from '../../../core/Tabs';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { InputV2 as Input } from '../../../forms/AmountInputV2';
import { AssetInput } from '../../../forms/AssetInput';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';
import { mockData, MockData, MockPoolData } from '../mock';
import { assetColorMapping, assetDarkColorMapping } from '../utils';
import { LiquidityChart } from './LiquidityChart';
import { RewardsOverview } from './RewardsOverview';

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

const getDataForAddress = (
  data: MockData,
  address?: string,
): MockPoolData | undefined => {
  if (!address) return;

  const { pools } = data;
  const active = pools.active.find(p => p.address === address);
  const user = pools.user.find(p => p.address === address);
  const deprecated = pools.deprecated.find(p => p.address === address);

  return active ?? user ?? deprecated;
};

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
  lpSymbol?: string;
  lpAddress?: string;
}> = ({ lpAddress, lpSymbol }) => {
  const addressOptions =
    (lpSymbol &&
      lpAddress && [
        {
          address: lpAddress,
          symbol: lpSymbol,
          label: lpSymbol,
          custom: true,
        },
      ]) ||
    undefined;

  const [address, setAddress] = useState<string | undefined>(
    addressOptions?.[0]?.address,
  );

  return (
    <TabContainer>
      <AssetInput
        addressOptions={addressOptions}
        address={address}
        handleSetAddress={setAddress}
      />
      <Button highlighted>Deposit</Button>
    </TabContainer>
  );
};

const Deposit: FC<{
  tokens?: SubscribedToken[];
}> = ({ tokens }) => {
  const addressOptions = tokens?.map(token => ({
    address: token.address,
    symbol: token.symbol,
    balance: token.balance,
  }));

  const [address, setAddress] = useState<string | undefined>(
    addressOptions?.[0]?.address,
  );

  return (
    <TabContainer>
      <AssetInput
        addressOptions={addressOptions}
        address={address}
        handleSetAddress={setAddress}
      />
      <Button highlighted>Deposit</Button>
    </TabContainer>
  );
};

export const PoolDetail: FC = () => {
  const { poolAddress } = useParams<{
    poolAddress?: string;
  }>();
  const [lookupAddress, setLookupAddress] = useState<string | undefined>();
  const inputText = useRef<string | undefined>();

  const data = getDataForAddress(mockData, poolAddress);
  const { tokenPair, poolTotal, userAmount, userStakedAmount, mtaRewards } =
    data ?? {};
  const subscribedTokens = useTokens(tokenPair ?? []);
  const title = subscribedTokens.map(t => t.symbol).join('/');
  const color = assetColorMapping[title];
  const darkColor = assetDarkColorMapping[title];

  const tabs = {
    Deposit: {
      title: 'Deposit',
      component: <Deposit tokens={subscribedTokens} />,
    },
    Withdraw: {
      title: 'Withdraw or Exit',
      component: <Withdraw lpAddress={poolAddress} lpSymbol={title} />,
    },
  };

  const [activeTab, setActiveTab] = useState<string>(Object.keys(tabs)[0]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      inputText.current = event.target.value ?? undefined;
    },
    [],
  );

  // eslint-disable-next-line no-alert
  const handleLookupClick = (): void => setLookupAddress(inputText.current);

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderContainer>
        <HeaderCard
          address={poolAddress}
          tokenPair={tokenPair}
          isLarge
          color={color}
        />
        <LiquidityChart color={darkColor} />
      </HeaderContainer>
      <AssetDetails>
        <h3>Asset Details</h3>
        <div>
          {poolAddress ? (
            <EtherscanLink data={poolAddress} type="address">
              <h3>{title}</h3>
            </EtherscanLink>
          ) : (
            <ThemedSkeleton width={48} height={32} />
          )}
          {subscribedTokens.map(token =>
            token.address ? (
              <EtherscanLink data={token.address} type="address">
                <p>{token.symbol}</p>
              </EtherscanLink>
            ) : (
              <ThemedSkeleton width={48} height={32} />
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
      <RewardsOverview
        title={title}
        poolTotal={poolTotal}
        userAmount={userAmount}
        userStakedAmount={userStakedAmount}
        mtaRewards={mtaRewards}
      />
      <Divider />
      <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab} />
    </Container>
  );
};
