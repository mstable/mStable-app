import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';

import { H2, P } from '../../core/Typography';
import { Button } from '../../core/Button';
import { ViewportWidth } from '../../../theme';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/gavel.svg';
import { ReactComponent as EarnIcon } from '../../icons/circle/earn.svg';
import { ReactComponent as SaveIcon } from '../../icons/circle/save.svg';
import { ReactComponent as SwapIcon } from '../../icons/circle/swap.svg';
import { ReactComponent as MintIcon } from '../../icons/circle/mint.svg';
import { useConnected, useConnect } from '../../../context/OnboardProvider';
import { useToggleWallet } from '../../../context/AppProvider';

const Symbol = styled.div`
  align-items: center;
  display: inline-flex;
  font-weight: bold;
  height: 80px;
  margin-top: 32px;

  svg {
    height: 80px;
    width: 80px;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  div {
    font-size: 24px;
    line-height: 32px;
    text-transform: capitalize;
    padding-right: 16px;
  }

  i {
    font-size: 60px;
    line-height: 80px;
    font-style: normal;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    div {
      font-size: 36px;
    }
    i {
      font-size: 120px;
    }
  }
`;

const ButtonContainer = styled(P)`
  display: flex;
  justify-content: flex-end;

  button {
    margin: 1rem 0;
  }
`;

const Block = styled.div`
  ${P} {
    font-size: ${({ theme }) => theme.fontSize.l};
  }
`;

const SymbolBlock = styled(Block)`
  display: flex;
`;

const CarouselItem = styled.section`
  min-height: 400px;

  > :first-child {
    padding-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    > :first-child {
      padding-bottom: 2rem;
    }
  }

  ${H2} {
    font-size: 28px;
    line-height: 1.3em;

    span {
      color: ${({ theme }) => theme.color.gold};
    }

    @media (min-width: ${ViewportWidth.s}) {
      font-size: 48px;
    }
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    display: flex;
    justify-content: space-between;

    > :first-child {
      flex: 4 0;
    }

    > :last-child {
      flex: 3 0;
    }
  }
`;

const Slider = styled.div<{ activeIdx: number }>`
  transition: transform 0.4s ease;
  transform: translateX(${({ activeIdx }) => -1 * (activeIdx * 100)}%);
  display: flex;
`;

const SliderContainer = styled.div`
  ${CarouselItem} {
    width: 100%;
    flex: 0 0 auto;
    flex-wrap: nowrap;
  }

  overflow: hidden;
`;

const StepIcons = styled.div`
  display: flex;
  padding: 0 32px;
`;

const StepIcon = styled.div<{ active: boolean; disabled: boolean }>`
  width: 12px;
  height: 12px;
  margin: 6px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  border-radius: 100%;
  background: ${({ theme, active }) =>
    active ? theme.color.offBlack : 'transparent'};
  border: 1px ${({ theme }) => theme.color.offBlack}
    ${({ disabled }) => (disabled ? 'dotted' : 'solid')};
  transition: background-color 0.3s ease;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Button} {
    background: transparent;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const Carousel = styled.div`
  color: ${({ theme }) => theme.color.body};
  padding: 0 16px;
  width: 100%;
  margin: 0 auto;
`;

const Start: FC<{}> = () => {
  const connected = useConnected();
  const connect = useConnect();
  const history = useHistory();
  return (
    <>
      <Block>
        <H2>
          mStable unites stablecoins, lending and swapping{' '}
          <span>into one standard.</span>
        </H2>
      </Block>
      <Block>
        <P>
          By reducing complexity and fragmentation, mStable is a step-change in
          the usability of stablecoins.
        </P>
        <ButtonContainer>
          <Button
            type="button"
            onClick={() => {
              if (connected) {
                history.push('/mint');
              } else {
                connect();
              }
            }}
          >
            {connected ? 'Go to app' : 'Connect'}
          </Button>
        </ButtonContainer>
      </Block>
    </>
  );
};

const GetStarted: FC<{}> = () => {
  const connect = useConnect();
  const connected = useConnected();
  const toggleWallet = useToggleWallet();
  return (
    <>
      <SymbolBlock>
        <Symbol>
          <div>get started</div>
        </Symbol>
      </SymbolBlock>
      <Block>
        <P>Start by connecting your Ethereum wallet</P>
        <P>
          <Button type="button" onClick={connected ? toggleWallet : connect}>
            Connect
          </Button>
        </P>
      </Block>
    </>
  );
};

const HOME_STEPS: {
  key: string;
  children: JSX.Element;
}[] = [
  {
    key: 'start',
    children: <Start />,
  },
  {
    key: 'mint',
    children: (
      <>
        <SymbolBlock>
          <Symbol>
            <div>Mint</div>
            <i>
              <MintIcon />
            </i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            Get mUSD by depositing your USDC, DAI, TUSD or USDT at a 1:1 ratio.
          </P>
          <P>
            <Link to="/mint">Go to mint</Link>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'save',
    children: (
      <>
        <SymbolBlock>
          <Symbol>
            <div>Save</div>
            <i>
              <SaveIcon />
            </i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>Earn mUSD&rsquo;s native interest rate.</P>
          <P>
            <Link to="/save">Go to save</Link>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'swap',
    children: (
      <>
        <SymbolBlock>
          <Symbol>
            <div>Swap</div>
            <i>
              <SwapIcon />
            </i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            Swap between stablecoins at zero slippage (a trading fee applies).
          </P>
          <P>
            <Link to="/swap">Go to swap</Link>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'earn',
    children: (
      <>
        <SymbolBlock>
          <Symbol>
            <div>Earn</div>
            <i>
              <EarnIcon />
            </i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            mStable rewards users who contribute mUSD liquidity across the DeFi
            ecosystem.
          </P>
          <P>
            <Link to="/earn">Go to earn</Link>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'govern',
    children: (
      <>
        <SymbolBlock>
          <Symbol>
            <div>govern</div>
            <i>
              <GovernanceIcon />
            </i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>Participate in system goverance</P>
          <P>
            <a href="https://governance.mstable.org">Go to governance</a>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'get-started',
    children: <GetStarted />,
  },
];

export const Home: FC = () => {
  const connect = useConnect();
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const next = useCallback(() => {
    if (activeIdx < HOME_STEPS.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      connect();
    }
  }, [setActiveIdx, activeIdx, connect]);

  const previous = useCallback(() => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  }, [setActiveIdx, activeIdx]);

  return (
    <Container>
      <Carousel>
        <SliderContainer>
          <Slider activeIdx={activeIdx}>
            {HOME_STEPS.map(({ children, key }) => (
              <CarouselItem key={key}>{children}</CarouselItem>
            ))}
          </Slider>
        </SliderContainer>
        <Controls>
          <Button onClick={previous} type="button" disabled={activeIdx === 0}>
            &lt;
          </Button>
          <StepIcons>
            {HOME_STEPS.map(({ key }, index) => (
              <StepIcon
                key={key}
                active={activeIdx === index}
                onClick={() => {
                  setActiveIdx(index);
                }}
                disabled={index === HOME_STEPS.length - 1}
              />
            ))}
          </StepIcons>
          <Button
            onClick={next}
            type="button"
            disabled={activeIdx === HOME_STEPS.length - 1}
          >
            &gt;
          </Button>
        </Controls>
      </Carousel>
    </Container>
  );
};
