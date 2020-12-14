import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';
import { H3 } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { AnalyticsLink } from '../Analytics/AnalyticsLink';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import {
  DEFAULT_SAVE_VERSION,
  SaveVersion,
  useActiveSaveVersionState,
} from './ActiveSaveVersionProvider';
import { SaveMigration } from './SaveMigration';

const { V1 } = SaveVersion;

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

const StyledWarningBadge = styled(WarningBadge)`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: -0.625em;
  top: 0;
`;

export const SaveInfo: FC = () => {
  const { versions, activeVersion } = useActiveSaveVersionState();
  const massetName = useSelectedMasset();
  const massetState = useSelectedMassetState();

  const isV1Deprecated = versions.length > 1;
  const isV1ActiveAndCurrent = isV1Deprecated && activeVersion === V1;

  const savingsBalance =
    massetState?.savingsContracts[
      `v${activeVersion ?? DEFAULT_SAVE_VERSION}` as 'v1' | 'v2'
    ]?.savingsBalance;

  return (
    <BalanceInfoRow>
      <H3>
        Your <b>{massetName}</b> savings balance
      </H3>
      <CreditBalance>
        <MUSDIconTransparent />
        <CountUp end={savingsBalance?.balance?.simple || 0} decimals={7} />
        {isV1ActiveAndCurrent && <StyledWarningBadge />}
      </CreditBalance>
      {isV1ActiveAndCurrent ? (
        <>
          <WarningMsg>
            Migrate your <b>{massetName}</b> to continue earning interest on
            your balance.
          </WarningMsg>
          <SaveMigration />
        </>
      ) : (
        <AnalyticsLink section="save" />
      )}
    </BalanceInfoRow>
  );
};
