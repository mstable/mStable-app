import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import useToggle from 'react-use/lib/useToggle';

import { Slider } from '../../core/Slider';
import { Token } from '../../core/Token';
import { H2, H3 } from '../../core/Typography';
import { Button } from '../../core/Button';
import { ExternalLink } from '../../core/ExternalLink';
import { Color, Size } from '../../../theme';
import { LocalStorage } from '../../../localStorage';
import { centredLayout } from '../../layout/css';
import { PoolCards } from './PoolCards';
import { PoolsOverview } from './PoolsOverview';

const StyledExternalLink = styled(ExternalLink)`
  color: ${Color.white};
  svg {
    path {
      fill: ${Color.white};
    }
  }
`;

const Header = styled.h3`
  padding: 16px;
  color: ${Color.white};
  font-weight: bold;
  text-transform: uppercase;
  span {
    text-transform: none;
  }
`;

const Screenshot = styled.div`
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    display: block;
  }
`;

const ItemContent = styled.div`
  padding: 16px 0;
  flex-grow: 1;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  ol {
    padding: 16px 0;
    text-align: left;
    list-style: decimal;
    li {
      margin-bottom: 8px;
    }
  }
`;

const ItemContainer = styled.div<{ slider?: boolean }>`
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  color: white;

  ${ItemContent} {
    align-items: ${({ slider }) => (slider ? 'auto' : 'center')};

    > * {
      max-width: ${({ slider }) => (slider ? 'auto' : '70%')};
    }
  }
`;

const Item: FC<{ title: string | JSX.Element; slider?: boolean }> = ({
  children,
  title,
  slider,
}) => (
  <ItemContainer slider={slider}>
    <Header>{title}</Header>
    <ItemContent>{children}</ItemContent>
  </ItemContainer>
);

const MtaToken = styled(Token)`
  justify-content: center;
  padding: 32px 0 64px 0;
  font-size: 64px;

  > :first-child {
    width: 64px;
    height: 64px;
    padding-right: 12px;
  }
`;

const IntroducingMeta: FC<{}> = () => (
  <Item
    title={
      <>
        Earn with <span>m</span>Stable
      </>
    }
  >
    <div>
      <MtaToken symbol="MTA" color={Color.white} />
      <p>Introducing Meta.</p>
    </div>
    <div>
      <p>
        Meta (MTA) is mStable's protocol token. Meta has three core functions:
      </p>
      <ol>
        <li>
          To act as the ultimate source of re-collateralisation (insurance).
        </li>
        <li>To coordinate decentralised governance.</li>
        <li>
          To incentivise the bootstrapping of mStable asset liquidity, utility
          and a community of Governors. mStable Ecosystem Rewards, (AKA "EARN"),
          rewards users who contribute mUSD liquidity across the ecosystem, for
          example in Balancer or Uniswap.
        </li>
      </ol>
    </div>
    <p>
      <StyledExternalLink href="https://medium.com/mstable/introducing-meta-mta-mstables-protocol-token-6e1032291ccf">
        Read more about MTA
      </StyledExternalLink>
    </p>
  </Item>
);

const TakingPart1: FC<{}> = () => (
  <Item title="Pool party">
    <p>Choose which platforms or pools you would like to contribute to.</p>
    <Screenshot>
      <img alt="" src="/overview.png" />
    </Screenshot>
  </Item>
);

const TakingPart2: FC<{}> = () => (
  <Item title="Dive in">
    <p>Contribute liquidity to the chosen pool.</p>
    <p>
      Platforms like Balancer or Uniswap will issue an ERC-20 LP (Liquidity
      Provider) token for your contribution.
    </p>
    <Screenshot>
      <img alt="" src="/balancer.png" />
    </Screenshot>
  </Item>
);

const TakingPart3: FC<{}> = () => (
  <Item title="The water's great">
    <p>"Stake" this LP token on the mStable App, through our intuitive UI.</p>
    <Screenshot>
      <img alt="" src="/stake.png" />
    </Screenshot>
  </Item>
);

const TakingPart4: FC<{}> = () => (
  <Item title="Do some laps">
    <p>
      Earn MTA rewards on a second by second basis, in addition to any third
      party tokens like BAL that may be up for grabs.
    </p>
    <Screenshot>
      <img alt="" src="/pool.png" />
    </Screenshot>
  </Item>
);

const TakingPart5: FC<{}> = () => (
  <Item title="Think of something witty">
    <p>Claim your rewards or withdraw your stake at any time!</p>
    <Screenshot>
      <img alt="" src="/claim.png" />
    </Screenshot>
  </Item>
);

const EarnMetaRewards: FC<{}> = () => {
  // As this is the last item, set LocalStorage
  useEffect(() => {
    LocalStorage.set('viewedEarnOnboarding', true);
  }, []);
  return (
    <Item title="Earn Meta rewards" slider>
      <H3>Select a pool to start earning.</H3>
      <PoolCards />
    </Item>
  );
};

const EARN_ITEMS = [
  {
    key: 'introducing-meta',
    children: <IntroducingMeta />,
  },
  {
    key: 'taking-part-1',
    children: <TakingPart1 />,
  },
  {
    key: 'taking-part-2',
    children: <TakingPart2 />,
  },
  {
    key: 'taking-part-3',
    children: <TakingPart3 />,
  },
  {
    key: 'taking-part-4',
    children: <TakingPart4 />,
  },
  {
    key: 'taking-part-5',
    children: <TakingPart5 />,
  },
  {
    key: 'pools',
    children: <EarnMetaRewards />,
  },
];

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top right, #000, #333);
  flex: 1;
  > * {
    flex: 1;
  }
`;

const Intro = styled.div`
  margin-bottom: 32px;
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
  justify-content: space-between;
  align-items: center;

  > * {
    flex: 1;
  }

  ${centredLayout}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const Earn: FC<{ initialItem?: string }> = ({ initialItem }) => {
  const viewedEarnOnboarding = !!LocalStorage.get('viewedEarnOnboarding');
  const [onboardingVisible, toggleOnboardingVisible] = useToggle(
    !viewedEarnOnboarding,
  );

  return (
    <Container>
      {onboardingVisible ? (
        <SliderContainer>
          <Slider
            items={EARN_ITEMS}
            initialItem={initialItem}
            bottomControls
            sideControls
            skipButton={
              <Button onClick={toggleOnboardingVisible} size={Size.s}>
                Skip introduction
              </Button>
            }
          />
        </SliderContainer>
      ) : (
        <Content>
          <div>
            <Intro>
              <H2>Earn staking rewards with mStable</H2>
              <Button onClick={toggleOnboardingVisible} size={Size.xs}>
                View introduction
              </Button>
            </Intro>
            <PoolsOverview />
          </div>
        </Content>
      )}
    </Container>
  );
};
