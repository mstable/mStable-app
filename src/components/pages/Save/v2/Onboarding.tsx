import styled from 'styled-components';
import React, { FC, useMemo } from 'react';
import { TokenIcon } from '../../../icons/TokenIcon';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { Tooltip } from '../../../core/ReactTooltip';
import { Arrow } from '../../../core/Arrow';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { ExternalLink } from '../../../core/ExternalLink';
import { UnstyledButton } from '../../../core/Button';
import { useOnboarding } from '../hooks';

const StyledTokenIcon = styled(TokenIcon)`
  width: 3rem;
`;

const CloseButton = styled(UnstyledButton)`
  padding: 1rem;
  background: rgba(255, 179, 52, 0.3);
  position: absolute;
  width: 2rem;
  height: 2rem;
  right: -0.5rem;
  top: -0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  font-size: 1rem;

  :hover {
    background: rgba(255, 179, 52, 0.45);
  }
`;

const Container = styled.div`
  ${({ theme }) => theme.mixins.card}
  border-color: rgba(255, 179, 52, 0.2);
  background: ${({ theme }) =>
    theme.isLight ? 'rgba(255, 253, 245, 0.3)' : 'none'};
  color: ${({ theme }) => theme.color.offYellow};
  text-align: center;
  position: relative;

  > div {
    h4 {
      font-weight: 600;
      margin: 0.5rem 0;
      span {
        font-weight: normal;
        margin-right: 0.25rem;
        font-size: 0.9rem;
      }
    }

    > div {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 179, 52, 0.1);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: flex-start;
      font-weight: 600;

      p {
        font-weight: normal;
        font-size: 0.9rem;
        span {
          font-weight: 600;
        }
      }

      > *:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
`;

export const OnboardingCard: FC = () => {
  const {
    token: massetToken,
    savingsContracts: {
      v2: { token: saveToken },
    },
    bAssets,
    fAssets,
  } = useSelectedMassetState() as MassetState;
  const massetName = useSelectedMassetName();
  const [, toggleOnboarding] = useOnboarding();

  const inputAssets = useMemo<string[]>(
    () =>
      [
        massetToken,
        ...Object.values(bAssets).map(b => b.token),
        ...Object.values(fAssets).map(b => b.token),
        { symbol: 'ETH' },
      ].map(t => t.symbol),
    [bAssets, fAssets, massetToken],
  );

  return (
    <Container>
      <CloseButton onClick={toggleOnboarding}>✕</CloseButton>
      <div>
        <h4>
          <span>1</span> Select an asset to deposit
        </h4>
        <p>
          This is swapped for {saveToken?.symbol}. You can swap back at any
          time.
        </p>
        <div>
          {inputAssets.map(symbol => (
            <Tooltip tip={symbol} key={symbol} hideIcon>
              <StyledTokenIcon symbol={symbol} />
            </Tooltip>
          ))}
        </div>
      </div>
      <Arrow />
      <div>
        <h4>
          <span>2</span> Receive {saveToken?.symbol} directly, or deposit it in
          the Vault
        </h4>
        <div>
          <div>
            <StyledTokenIcon symbol={saveToken?.symbol} />
            <div>{saveToken?.symbol}</div>
            <p>Transferable token, earns interest</p>
          </div>
          <div>
            <StyledTokenIcon symbol={`v-${saveToken?.symbol}`} />
            <div>{saveToken?.symbol} Vault</div>
            <p>Earns interest and MTA rewards</p>
            {massetName === 'mbtc' && (
              <p>
                <span>Recommended for BTC</span>
              </p>
            )}
          </div>
        </div>
      </div>
      <Arrow />
      <div>
        <h4>
          <span>3</span> Earn interest on your deposit
        </h4>
        <p>
          Over time, your {saveToken?.symbol} can be exchanged for more{' '}
          {massetToken.symbol}.
        </p>
      </div>
      {massetName === 'musd' && (
        <>
          <Arrow />
          <div>
            <h4>
              <span>4</span> Do more with your imUSD in DeFi{' '}
              <span>(optional)</span>
            </h4>
            <p>
              You can even mint{' '}
              <ExternalLink href="https://app.arcx.money/mint">
                StableX tokens
              </ExternalLink>{' '}
              with your imUSD as collateral!
            </p>
          </div>
        </>
      )}
    </Container>
  );
};
