import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { useAccount } from '../../../context/UserProvider';
import { MerkleDrop } from '../../../context/earn/types';
import { useSignerContext } from '../../../context/SignerProvider';
import { useMerkleDrops } from '../../../context/earn/EarnDataProvider';
import { BigDecimal } from '../../../web3/BigDecimal';
import { humanizeList } from '../../../web3/strings';
import { Interfaces } from '../../../types';
import { MerkleDropFactory } from '../../../typechain/MerkleDropFactory';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { Amount, NumberFormat } from '../../core/Amount';
import { H3, P } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { Protip } from '../../core/Protip';
import { Size } from '../../../theme';

const Container = styled.div`
  min-width: 260px;
`;

const ConfirmAmount = styled.div`
  font-size: 14px;
`;

const MerkleDropConfirmLabel: FC<{
  amount: BigDecimal;
  tranches: string[];
  symbol: string;
  decimals: number;
}> = ({ amount, decimals, symbol, tranches }) => (
  <>
    <div>
      Week{tranches.length > 1 ? 's' : ''} {humanizeList(tranches)}
    </div>
    <ConfirmAmount>
      <Amount
        format={NumberFormat.Long}
        amount={amount}
        decimalPlaces={decimals}
      />{' '}
      {symbol}
    </ConfirmAmount>
  </>
);

const MerkleDropClaimForm: FC<{ merkleDrop: MerkleDrop }> = ({
  merkleDrop,
}) => {
  const account = useAccount();
  const signer = useSignerContext();
  const setFormManifest = useSetFormManifest();
  const {
    totalUnclaimed,
    address,
    unclaimedTranches,
    token: { symbol, decimals },
  } = merkleDrop;
  const { refresh } = useMerkleDrops();

  useEffect(() => {
    if (account && unclaimedTranches && signer) {
      const contract = MerkleDropFactory.connect(address, signer);

      const tranches = unclaimedTranches.map(t => t.trancheNumber);
      const balances = unclaimedTranches.map(t => t.allocation);
      const proofs = unclaimedTranches.map(t => t.proof);

      if (tranches.length > 1) {
        setFormManifest<Interfaces.MerkleDrop, 'claimWeeks'>({
          args: [account, tranches, balances, proofs],
          fn: 'claimWeeks',
          iface: contract,
          onFinalized: refresh,
        });
      } else {
        setFormManifest<Interfaces.MerkleDrop, 'claimWeek'>({
          args: [account, tranches[0], balances[0], proofs[0]],
          fn: 'claimWeek',
          iface: contract,
          onFinalized: refresh,
        });
      }
    }
  }, [account, address, refresh, setFormManifest, signer, unclaimedTranches]);

  return (
    <TransactionForm
      compact
      confirmLabel={
        <MerkleDropConfirmLabel
          amount={totalUnclaimed}
          symbol={symbol}
          decimals={decimals}
          tranches={unclaimedTranches.map(t => t.trancheNumber.toString())}
        />
      }
      valid={unclaimedTranches.length > 0}
    />
  );
};

export const MerkleDropClaims: FC<{}> = () => {
  const account = useAccount();
  const { merkleDrops } = useMerkleDrops();

  const hasUnclaimedAmounts = Object.values(merkleDrops).some(d =>
    d.totalUnclaimed.exact.gt(0),
  );

  const hasSingleUnclaimedTranche = Object.values(merkleDrops).some(
    d => d.unclaimedTranches.length === 1,
  );

  return (
    <Container>
      <Tooltip tip="Platform rewards (e.g. BAL) can be earned in some pools. When available, these rewards can be claimed here.">
        <H3>Claim rewards</H3>
      </Tooltip>
      {hasUnclaimedAmounts ? (
        <div>
          {Object.values(merkleDrops).map(merkleDrop => (
            <FormProvider formId={merkleDrop.address} key={merkleDrop.address}>
              <MerkleDropClaimForm merkleDrop={merkleDrop} />
            </FormProvider>
          ))}
        </div>
      ) : account ? (
        <div>No rewards to claim at this time.</div>
      ) : null}
      {hasSingleUnclaimedTranche ? (
        <Protip emoji="💸">
          <P size={Size.s}>
            If you are planning to stake across multiple weeks, you can wait and
            claim all rewards (of the same token) in one transaction!
          </P>
        </Protip>
      ) : null}
    </Container>
  );
};
