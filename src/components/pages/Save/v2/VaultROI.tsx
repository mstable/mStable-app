import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { getUnixTime } from 'date-fns';
import { BigNumber } from 'ethers/utils';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useVaultWeeklyROI } from '../../../../hooks/useVaultWeeklyROI';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { CountUp } from '../../../core/CountUp';
import { Tooltip } from '../../../core/ReactTooltip';

const StyledCountUp = styled(CountUp)`
  font-size: 1rem;
  font-weight: normal;
  color: ${({ theme }) => theme.color.body};
`;

const Subtitle = styled.div`
  font-weight: 600;
`;

const Container = styled.div`
  font-size: 1rem;

  > * {
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  span > svg {
    margin-right: 0 !important;
  }
`;

const nowUnix = getUnixTime(Date.now());

// TODO check weekly ROI values once deposits settle down

export const VaultROI: FC = () => {
  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts?.v2?.boostedSavingsVault;
  const weeklyROI = useVaultWeeklyROI();

  const rewardsText = useMemo<string>(() => {
    if (vault && nowUnix < vault.periodFinish) {
      const rewards = new BigDecimal(
        new BigNumber(vault.periodDuration).mul(vault.rewardRate),
      );
      return `+ ${rewards.abbreviated} MTA weekly`;
    }

    return '+ MTA';
  }, [vault]);

  return (
    <Container>
      <div>{rewardsText}</div>
      {weeklyROI.baseValue && weeklyROI.baseValue < 1000 && (
        <div>
          <Subtitle>Weekly ROI (MTA only)</Subtitle>
          {weeklyROI.fetching ? (
            <Skeleton height={4} width={40} />
          ) : (
            <Tooltip tip="This is calculated as: (reward per imUSD * current MTA price) / (imUSD price)">
              <StyledCountUp end={weeklyROI.baseValue} suffix="%" />
            </Tooltip>
          )}
        </div>
      )}
    </Container>
  );
};
