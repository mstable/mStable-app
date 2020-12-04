import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { Interfaces, SendTxManifest } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { useRewardsEarned } from '../StakingRewardsContractProvider';
import { CountUp } from '../../../core/CountUp';
import { H3, P } from '../../../core/Typography';
import {
  CURVE_ADDRESSES,
  useCurveContracts,
} from '../../../../context/earn/CurveProvider';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC<{ symbol: 'MTA' | 'CRV' }> = ({ symbol }) => {
  const { rewards, platformRewards } = useRewardsEarned();
  const selectedRewards = symbol === 'CRV' ? platformRewards : rewards;

  return (
    <div>
      {selectedRewards?.exact.gt(0) ? (
        <P>
          Claim{' '}
          <CountUp
            end={selectedRewards?.simple}
            decimals={6}
            suffix={` ${symbol}`}
          />
          .
        </P>
      ) : (
        'No rewards to claim.'
      )}
    </div>
  );
};

const ClaimMTA: FC = () => {
  const { rewards } = useRewardsEarned();
  const { musdGauge } = useCurveContracts();
  const setFormManifest = useSetFormManifest();

  const valid = !!rewards?.exact.gt(0);

  useEffect(() => {
    if (valid && musdGauge) {
      const manifest: SendTxManifest<
        Interfaces.CurveGauge,
        'claim_rewards()'
      > = {
        args: [],
        iface: musdGauge,
        fn: 'claim_rewards()',
        purpose: {
          present: 'Claiming MTA rewards',
          past: 'Claimed MTA rewards',
        },
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, musdGauge]);

  return (
    <TransactionForm
      compact
      confirmLabel="Claim MTA"
      input={<Input symbol="MTA" />}
      valid={valid}
    />
  );
};

const ClaimCRV: FC = () => {
  const { platformRewards } = useRewardsEarned();
  const { tokenMinter } = useCurveContracts();
  const setFormManifest = useSetFormManifest();

  const valid = !!platformRewards?.exact.gt(0);

  useEffect(() => {
    if (valid && tokenMinter) {
      const manifest: SendTxManifest<Interfaces.CurveTokenMinter, 'mint'> = {
        args: [CURVE_ADDRESSES.MUSD_GAUGE],
        iface: tokenMinter,
        fn: 'mint',
        purpose: {
          present: 'Claiming CRV rewards',
          past: 'Claimed CRV rewards',
        },
      };
      setFormManifest(manifest);
    } else {
      setFormManifest(null);
    }
  }, [setFormManifest, valid, tokenMinter]);

  return (
    <TransactionForm
      compact
      confirmLabel="Claim CRV"
      input={<Input symbol="CRV" />}
      valid={valid}
    />
  );
};

const ClaimButtons = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    width: 100%;
  }

  > :first-child {
    margin-right: 8px;
  }

  > :last-child {
    margin-left: 8px;
  }
`;

export const CurveClaim: FC = () => {
  return (
    <Row>
      <H3 borderTop>Claim rewards</H3>
      <ClaimButtons>
        <FormProvider formId="claimMTA">
          <ClaimMTA />
        </FormProvider>
        <FormProvider formId="claimCRV">
          <ClaimCRV />
        </FormProvider>
      </ClaimButtons>
      <P>
        You will continue to earn any available rewards with your staked
        balance.
      </P>
    </Row>
  );
};
