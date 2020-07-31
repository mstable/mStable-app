import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { A, navigate } from 'hookrouter';
import { useWallet } from 'use-wallet';
import { H2, P } from '../../core/Typography';
import { Button } from '../../core/Button';
import { Size, ViewportWidth } from '../../../theme';
import { useOpenWalletRedirect } from '../../../context/AppProvider';

const BETA_WARNING_KEY = 'acknowledged-beta-warning';

const clickMe = keyframes`
  from {
    background: transparent;
  }
  to {
    background: white;
  }
`;

const AckButton = styled(Button)`
  animation: ${clickMe} 2s ease infinite alternate-reverse;
`;

const ctx = createContext<{
  acknowledgeDisclaimer(): void;
  alreadyAcked: boolean;
}>({} as never);

const Symbol = styled.div`
  align-items: center;
  display: inline-flex;
  font-weight: bold;
  height: 80px;
  margin-top: 32px;

  div {
    font-size: 24px;
    line-height: 32px;
    text-transform: lowercase;
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
    padding-bottom: 64px;
  }

  ${H2} {
    font-size: 28px;
    line-height: 1.3em;

    span {
      color: white;
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
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const Carousel = styled.div`
  color: ${({ theme }) => theme.color.offBlack};

  a {
    color: ${({ theme }) => theme.color.offBlack};
  }

  ${Button} {
    background: transparent;
  }

  padding: 0 16px;
  width: 100%;
  margin: 0 auto;
`;

const Start: FC<{}> = () => {
  const { connected } = useWallet();
  const openWallet = useOpenWalletRedirect();
  const { alreadyAcked } = useContext(ctx);
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
        {alreadyAcked ? (
          <P>
            <Button
              type="button"
              size={Size.l}
              onClick={() => {
                if (connected) {
                  navigate('/mint');
                } else {
                  openWallet('/mint');
                }
              }}
            >
              {connected ? 'Go to app' : 'Connect'}
            </Button>
          </P>
        ) : null}
      </Block>
    </>
  );
};

const Disclaimer: FC<{}> = () => {
  const { acknowledgeDisclaimer } = useContext(ctx);
  return (
    <>
      <SymbolBlock>
        <Symbol>
          <div>Beta</div>
          <i>!</i>
        </Symbol>
      </SymbolBlock>
      <Block>
        <P>
          The{' '}
          <a
            href="https://github.com/mstable/mstable-contracts"
            target="_blank"
            rel="noreferrer noopener"
          >
            mStable protocol contracts
          </a>{' '}
          have been professionally audited. However, please be aware the project
          remains in beta. Use at your own risk.
        </P>
        <P>
          <AckButton
            type="button"
            size={Size.l}
            onClick={acknowledgeDisclaimer}
          >
            I understand
          </AckButton>
        </P>
      </Block>
    </>
  );
};

const GetStarted: FC<{}> = () => {
  const openWallet = useOpenWalletRedirect();
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
          <Button
            type="button"
            size={Size.m}
            onClick={() => openWallet('/mint')}
          >
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
            <i>+</i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            Get mUSD by depositing your USDC, DAI, TUSD or USDT at a 1:1 ratio.
          </P>
          <P>
            <A href="/mint">Go to mint</A>
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
            <i>×</i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>Earn mUSD&rsquo;s native interest rate.</P>
          <P>
            <A href="/save">Go to save</A>
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
            <i>=</i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            Swap between stablecoins at zero slippage (a trading fee applies).
          </P>
          <P>
            <A href="/swap">Go to swap</A>
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
            <i>$</i>
          </Symbol>
        </SymbolBlock>
        <Block>
          <P>
            mStable rewards users who contribute mUSD liquidity across the DeFi
            ecosystem.
          </P>
          <P>
            <A href="/earn">Go to earn</A>
          </P>
        </Block>
      </>
    ),
  },
  {
    key: 'disclaimer',
    children: <Disclaimer />,
  },
  {
    key: 'get-started',
    children: <GetStarted />,
  },
];

export const Home: FC<{}> = () => {
  const openWallet = useOpenWalletRedirect();
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const alreadyAcked = !!localStorage.getItem(BETA_WARNING_KEY);
  const [acked, setAcked] = useState<boolean>(alreadyAcked || false);
  const needsAck = activeIdx === 4 && !acked;

  const next = useCallback(() => {
    if (activeIdx < HOME_STEPS.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      openWallet('/mint');
    }
  }, [setActiveIdx, activeIdx, openWallet]);

  const previous = useCallback(() => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  }, [setActiveIdx, activeIdx]);

  const acknowledgeDisclaimer = useCallback(() => {
    setAcked(true);
    localStorage.setItem(BETA_WARNING_KEY, Date.now().toString());
    next();
  }, [setAcked, next]);

  return (
    <ctx.Provider
      value={useMemo(() => ({ acknowledgeDisclaimer, alreadyAcked }), [
        alreadyAcked,
        acknowledgeDisclaimer,
      ])}
    >
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
            <Button
              onClick={previous}
              type="button"
              size={Size.m}
              disabled={activeIdx === 0}
            >
              Previous
            </Button>
            <StepIcons>
              {HOME_STEPS.map(({ key }, index) => (
                <StepIcon
                  key={key}
                  active={activeIdx === index}
                  onClick={() => {
                    if (!needsAck) setActiveIdx(index);
                  }}
                  disabled={index === HOME_STEPS.length - 1 && needsAck}
                />
              ))}
            </StepIcons>
            <Button
              onClick={next}
              type="button"
              size={Size.m}
              disabled={activeIdx === HOME_STEPS.length - 2 && needsAck}
            >
              Next
            </Button>
          </Controls>
        </Carousel>
      </Container>
    </ctx.Provider>
  );
};
