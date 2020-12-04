import React, { FC } from 'react';
import styled from 'styled-components';

import { H3 } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { useV1SavingsBalance } from '../../../context/DataProvider/DataProvider';
import { AnalyticsLink } from '../Analytics/AnalyticsLink';
import { SaveVersion } from '../../../types';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import { Button } from '../../core/Button';

const { CURRENT } = SaveVersion;

const CreditBalance = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 1rem 0;
  font-size: 2.5rem;

  img {
    height: 0.66em;
    margin-right: 10px;
  }

  span {
    font-size: 1em;
    line-height: 1em;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    font-size: 3rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    font-size: 3.5rem;
  }
`;

const WarningMsg = styled.div`
  padding-top: 4px;
  font-size: 12px;
  background: #ffeaea;
  color: #de1717;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
`;

const InfoRow = styled.div`
  text-align: center;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: flex;
    justify-content: space-evenly;
  }
`;

const BalanceInfoRow = styled(InfoRow)`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;

  h3 {
    padding: 0;
  }
`;

interface Props {
  version: SaveVersion;
  onMigrateClick: () => void;
}

const StyledWarningBadge = styled(WarningBadge)`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: -0.625em;
  top: 0;
`;

// TODO
const useSavingsBalance = (): any => undefined;

export const SaveInfo: FC<Props> = ({ version, onMigrateClick }) => {
  const savingsBalance = useSavingsBalance();
  const isCurrentVersion = version === CURRENT;

  return (
    <>
      <BalanceInfoRow>
        <H3>
          Your <b>mUSD</b> savings balance
        </H3>
        <CreditBalance>
          <MUSDIconTransparent />
          <CountUp end={savingsBalance?.balance?.simple || 0} decimals={7} />
          {!isCurrentVersion && <StyledWarningBadge />}
        </CreditBalance>
        {isCurrentVersion ? (
          <AnalyticsLink section="save" />
        ) : (
          <>
            <WarningMsg>
              Migrate your <b>mUSD</b> to continue earning interest on your
              balance.
            </WarningMsg>
            {/* (to be removed) */}
            <Button onClick={onMigrateClick}>Migrate!</Button>
          </>
        )}
      </BalanceInfoRow>
    </>
  );
};
