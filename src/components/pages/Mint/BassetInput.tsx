import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'ethers/utils';

import { useBassetData } from '../../../context/DataProvider/DataProvider';
import { useErc20Contract } from '../../../context/DataProvider/ContractsProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { Interfaces, SendTxManifest } from '../../../types';
import { Size } from '../../../theme';
import { Button } from '../../core/Button';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { ToggleInput } from '../../forms/ToggleInput';
import { TokenIcon } from '../../icons/TokenIcon';
import { BassetInput as BassetInputProps, Reasons } from './types';

interface Props {
  input: BassetInputProps;
  mAssetAddress: string | null;
  toggleDisabled: boolean;
  handleToggle(address: string): void;
}

const CountUp = styled(CountUpBase)<{
  highlight?: boolean;
}>`
  display: block;
  text-align: right;
  color: ${({ theme, highlight }) =>
    highlight ? theme.color.blue : theme.color.offBlack};
  font-weight: ${({ highlight }) => (highlight ? '600' : '400')};
`;

const Symbol = styled.div``;

const Row = styled.div`
  padding: 8px 0;
  border-bottom: 1px ${({ theme }) => theme.color.blackTransparent} solid;

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    border-bottom: 0;
  }

  > * {
    transition: opacity 0.4s ease;
  }
`;

const ToggleRow = styled(Row)``;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.l};
  font-weight: bold;

  img {
    width: 36px;
    height: 36px;
    padding-right: 4px;
  }
`;

const HeaderRow = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    opacity: 1 !important;
  }
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;
`;

const Value = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const ApproveButton = styled(Button)`
  width: 100%;
`;

const ErrorRow = styled.div`
  margin-bottom: 8px;
`;

const Rows = styled.div<{
  enabled: boolean;
  valid: boolean;
  overweight?: boolean;
}>`
  border: 1px
    ${({ theme, valid }) =>
      valid ? theme.color.blackTransparent : theme.color.redTransparent}
    solid;
  border-radius: 3px;
  background: ${({ theme, valid, overweight }) =>
    overweight
      ? theme.color.blackTransparenter
      : valid
      ? theme.color.white
      : theme.color.redTransparenter};
  padding: ${({ theme }) => theme.spacing.xs};

  ${Row} > * {
    opacity: ${({ enabled }) => (enabled ? '1' : '0.3')};
  }

  ${ToggleRow} > * {
    opacity: 1;
  }
`;

export const BassetInput: FC<Props> = ({
  input: { address, amount, enabled, error },
  handleToggle,
  mAssetAddress,
  toggleDisabled,
}) => {
  const {
    overweight,
    token: { balance, decimals, symbol } = {
      balance: null,
      decimals: null,
      symbol: null,
    },
  } = useBassetData(address) || {};

  const sendTransaction = useSendTransaction();
  const tokenContract = useErc20Contract(address);

  const unlock = useCallback((): void => {
    if (!(tokenContract && mAssetAddress)) return;

    tokenContract.totalSupply().then(totalSupply => {
      const manifest: SendTxManifest<Interfaces.ERC20, 'approve'> = {
        iface: tokenContract,
        fn: 'approve',
        formId: 'mint',
        args: [mAssetAddress, totalSupply],
      };
      sendTransaction(manifest);
    });
  }, [sendTransaction, tokenContract, mAssetAddress]);

  const toggle = useCallback(() => {
    handleToggle(address);
  }, [handleToggle, address]);

  const simpleBalance = useMemo<number>(
    () =>
      balance && decimals ? parseFloat(formatUnits(balance, decimals)) : 0,
    [balance, decimals],
  );

  const needsUnlock = error === Reasons.AmountExceedsApprovedAmount;

  return (
    <div>
      <Rows overweight={overweight} enabled={enabled} valid={error === null}>
        <HeaderRow>
          <TokenContainer>
            {symbol ? <TokenIcon symbol={symbol} /> : null}
            <Symbol>{symbol}</Symbol>
          </TokenContainer>
          <ToggleInput
            onClick={toggle}
            disabled={toggleDisabled}
            checked={enabled}
          />
        </HeaderRow>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={simpleBalance} />
        </Row>
        <Row>
          <Label>Amount</Label>
          <CountUp
            highlight={!!amount.simple}
            duration={0.4}
            end={amount.simple || 0}
            prefix="- "
          />
        </Row>
      </Rows>
      <Row>
        {error || overweight ? (
          <ErrorRow>
            <Label>Unable to mint</Label>
            <Value>{error || 'Asset overweight'}</Value>
          </ErrorRow>
        ) : null}
        {needsUnlock || error || overweight ? (
          <div>
            {needsUnlock ? (
              <ApproveButton size={Size.s} onClick={unlock} type="button">
                Approve
              </ApproveButton>
            ) : null}
          </div>
        ) : null}
      </Row>
    </div>
  );
};
