import React, { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useTokens } from '../../../../context/TokensProvider';
import { Button } from '../../../core/Button';
import { EtherscanLink } from '../../../core/EtherscanLink';
import { TabSwitch } from '../../../core/Tabs';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { InputV2 as Input } from '../../../forms/AmountInputV2';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';
import { mockData, MockData, MockPoolData } from '../mock';
import { RewardsOverview } from './RewardsOverview';

const UserLookup = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  p {
    font-weight: 600;
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
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  align-items: center;
  margin-top: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1.25rem;
  }

  > div {
    display: flex;
  }

  > div a {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.125rem;
  }

  > div a:not(:last-child) {
    margin-right: 2rem;
  }
`;

const HeaderCard = styled(AssetCard)`
  flex: 1;

  h2 {
    font-size: 1.75rem;
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
  const active = pools.active.find((p) => p.address === address);
  const user = pools.user.find((p) => p.address === address);
  const deprecated = pools.deprecated.find((p) => p.address === address);

  return active ?? user ?? deprecated;
};

const tabs = {
  Deposit: {
    title: 'Deposit',
    component: <p>Test</p>,
  },
  Withdraw: {
    title: 'Withdraw or Exit',
    component: <p>Test 2</p>,
  },
};

export const PoolDetail: FC = () => {
  const { poolAddress } = useParams<{
    poolAddress?: string;
  }>();
  const [lookupAddress, setLookupAddress] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>(Object.keys(tabs)[0]);

  const data = getDataForAddress(mockData, poolAddress);
  const { tokenPair, poolTotal, userAmount, userStakedAmount, mtaRewards } =
    data ?? {};
  const subscribedTokens = useTokens(tokenPair ?? []);
  const title = subscribedTokens.map((t) => t.symbol).join('/');

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => setLookupAddress(event.target.value ?? undefined),
    [],
  );

  // eslint-disable-next-line no-alert
  const handleLookupClick = (): void => alert(lookupAddress);

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderCard address={poolAddress} tokenPair={tokenPair} isLarge />
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
          {subscribedTokens.map((token) =>
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
        <p>Lookup user balance:</p>
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
