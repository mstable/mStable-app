import React, { FC } from 'react';
import styled from 'styled-components';

import { BigDecimal } from '../../web3/BigDecimal';
import { Tooltip } from './ReactTooltip';
import { CollapseBox } from '../forms/CollapseBox';
import { SlippageInput } from '../forms/SlippageInput';

interface Props {
  className?: string;
  fee?: BigDecimal;
  onSetSlippage?(formValue?: string): void;
  slippageFormValue?: string;
  minOutputAmount?: BigDecimal;
  maxOutputAmount?: BigDecimal;
}

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;

  > span:last-child {
    font-size: 1rem;
    ${({ theme }) => theme.mixins.numeric}
  }
`;

const AdvancedBox = styled(CollapseBox)`
  margin-top: 0.5rem;
`;

const AdditionalInfo = styled.div`
  background: ${({ theme }) => theme.color.backgroundAccent};
  border-radius: 0.75rem;
`;

export const TransactionInfo: FC<Props> = ({
  fee,
  minOutputAmount,
  maxOutputAmount,
  className,
  onSetSlippage,
  slippageFormValue,
}) => {
  const showAdditionalInfo = fee || minOutputAmount || maxOutputAmount;
  return (
    <>
      {onSetSlippage && (
        <AdvancedBox title="Advanced">
          <SlippageInput
            handleSetSlippage={onSetSlippage}
            slippageFormValue={slippageFormValue}
          />
        </AdvancedBox>
      )}
      {showAdditionalInfo && (
        <AdditionalInfo className={className}>
          {fee && (
            <Info>
              <p>
                <Tooltip tip="The received amount includes a small swap fee. Swap fees are sent directly to Savers.">
                  Swap Fee
                </Tooltip>
              </p>
              <span>{fee.string}</span>
            </Info>
          )}
          {minOutputAmount && (
            <Info>
              <p>
                <Tooltip tip="The minimum amount received (based on the estimated swap output and the selected slippage).">
                  Minimum received
                </Tooltip>
              </p>
              <span>{minOutputAmount?.format(8, false)}</span>
            </Info>
          )}
          {maxOutputAmount && (
            <Info>
              <p>
                <Tooltip tip="The maximum amount that will be sent (based on the estimated swap output and the selected slippage).">
                  Maximum cost
                </Tooltip>
              </p>
              <span>{maxOutputAmount?.format(8, false)}</span>
            </Info>
          )}
        </AdditionalInfo>
      )}
    </>
  );
};
