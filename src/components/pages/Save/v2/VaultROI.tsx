import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { getUnixTime } from 'date-fns';
import { BigNumber } from 'ethers/utils';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useVaultWeeklyROI } from '../../../../hooks/useVaultWeeklyROI';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { CountUp } from '../../../core/CountUp';

const StyledCountUp = styled(CountUp)`
  font-size: 1rem;
`;

const Container = styled.div``;

const nowUnix = getUnixTime(Date.now());

export const VaultROI: FC = () => {
  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts?.v2?.boostedSavingsVault;
  const weeklyROI = useVaultWeeklyROI();

  const rewardsText = useMemo<string>(() => {
    if (vault && nowUnix < vault.periodFinish) {
      const rewards = new BigDecimal(
        new BigNumber(vault.periodDuration).mul(vault.rewardRate),
      );
      return `${rewards.abbreviated} MTA weekly`;
    }

    return '+ MTA';
  }, [vault]);

  return (
    <Container>
      <div>{rewardsText}</div>
      <div>
        <h5>Weekly ROI (unstable)</h5>
        {weeklyROI.fetching ? (
          <Skeleton height={4} width={40} />
        ) : (
          <StyledCountUp end={weeklyROI.baseValue} suffix="%" />
        )}
      </div>
    </Container>
  );
};
