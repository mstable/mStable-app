import React, { FC } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { useAccount } from '../../../../context/UserProvider';
import { Button } from '../../../core/Button';
import { useRenState } from '../../../../context/RenProvider';
import { getBlockchairLink, getEtherscanLink } from '../../../../utils/strings';
import { ExternalLink } from '../../../core/ExternalLink';
import { AnimatedTick } from '../../../core/AnimatedTick';
import { useRenMintDispatch } from './RenMintProvider';

const Address = styled.div`
  ${({ theme }) => theme.mixins.numeric};
  padding: 0 1.75rem;
  word-break: break-all;
  border: 1px solid ${({ theme }) => theme.color.accent};
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-align: center;
  justify-content: center;

  a {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const Confirmation = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:first-child) {
    line-height: 1rem;
    align-items: center;
    display: flex;
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
`;

export const RenMintFinalize: FC = () => {
  const address = useAccount();
  const { current, storage } = useRenState();
  const { setOnboardData } = useRenMintDispatch();

  const [tickShouldAppear, toggleTickAnimation] = useToggle(false);

  const currentId = current?.id;
  const currentTransaction = (currentId && storage[currentId]) || undefined;

  // FIXME: - Remove mock data fallback
  const btcGatewayAddress =
    currentTransaction?.gatewayAddress ?? '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX';
  const btcDepositAmount =
    currentTransaction?.depositDetails.amount ?? '1.0231';
  const ethAddress = address ?? '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';

  const handleConfirmClick = (): void => {
    // TODO: - Can be replaced with callback on eth tx hash
    toggleTickAnimation();

    setTimeout(() => {
      setOnboardData(undefined);
    }, 5000);
  };

  return tickShouldAppear ? (
    <AnimatedTick size={100} />
  ) : (
    <>
      <Confirmation>
        <p>
          Sucessfully deposited <span>{btcDepositAmount}</span> BTC to:
        </p>
        <Address>
          <ExternalLink href={getBlockchairLink(btcGatewayAddress, 'address')}>
            {btcGatewayAddress}
          </ExternalLink>
        </Address>
      </Confirmation>
      <Confirmation>
        <p>
          To finalize, you will need to send a transaction from the following
          Ethereum address:
        </p>
        <Address>
          <ExternalLink href={getEtherscanLink(ethAddress, 'address')}>
            {ethAddress}
          </ExternalLink>
        </Address>
      </Confirmation>
      <Button highlighted onClick={handleConfirmClick}>
        Finalize
      </Button>
    </>
  );
};
