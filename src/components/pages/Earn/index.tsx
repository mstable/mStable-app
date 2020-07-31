import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import useToggle from 'react-use/lib/useToggle';
import createStateContext from 'react-use/lib/createStateContext';

import { useStakingRewardsContracts } from '../../../context/earn/EarnDataProvider';
import { Slider } from '../../core/Slider';
import { Token } from '../../core/Token';
import { H2, H3, P } from '../../core/Typography';
import { Button } from '../../core/Button';
import { ExternalLink } from '../../core/ExternalLink';
import { Color, FontSize, Size } from '../../../theme';
import { LocalStorage } from '../../../localStorage';
import { centredLayout } from '../../layout/css';
import { PoolsOverview } from './PoolsOverview';
import { Card } from './Card';

const [useSwipeDisabled, SwipeDisabledProvider] = createStateContext(false);

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
  font-size: ${FontSize.l};
  text-transform: uppercase;
  span {
    text-transform: none;
  }
`;

const Screenshot = styled.div`
  border-radius: 4px;
  overflow: hidden;
  box-shadow: ${Color.blackTransparent} 0 8px 12px;

  img {
    width: 100%;
    max-width: 500px;
    height: auto;
    display: block;
  }
`;

const ItemContent = styled.div`
  padding: 8px 16px 32px 16px;
  flex-grow: 1;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  ol {
    padding: 16px;
    text-align: left;
    list-style: decimal;
    li {
      margin-bottom: 8px;
    }
  }

  p {
    padding-left: 8px;
    padding-right: 8px;
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
      max-width: ${({ slider }) => (slider ? 'auto' : '500px')};
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
    <MtaToken symbol="MTA" color={Color.white} />
    <div>
      <P>Introducing Meta.</P>
      <P>
        Meta (MTA) is mStable's protocol token. Meta has three core functions:
      </P>
      <ol>
        <li>
          To act as the ultimate source of re-collateralisation (insurance).
        </li>
        <li>To coordinate decentralised governance.</li>
        <li>
          To incentivise the bootstrapping of mStable asset liquidity, utility
          and a community of Governors.
        </li>
      </ol>
      <P>
        <StyledExternalLink href="https://medium.com/mstable/introducing-meta-mta-mstables-protocol-token-6e1032291ccf">
          Read more about MTA
        </StyledExternalLink>
      </P>
    </div>
  </Item>
);

const TakingPart1: FC<{}> = () => (
  <Item title="Pool party">
    <P>Choose which platforms or pools you would like to contribute to.</P>
    <Screenshot>
      <img alt="" src="/overview.png" />
    </Screenshot>
  </Item>
);

const TakingPart2: FC<{}> = () => (
  <Item title="Test the waters">
    <div>
      <P>Contribute liquidity to the chosen pool.</P>
      <P>
        Platforms like Balancer or Uniswap will issue an ERC-20 LP (Liquidity
        Provider) token for your contribution.
      </P>
    </div>
    <Screenshot>
      <img alt="" src="/balancer.png" />
    </Screenshot>
  </Item>
);

const TakingPart3: FC<{}> = () => (
  <Item title="Dive in">
    <P>"Stake" this LP token on the mStable App, through our intuitive UI.</P>
    <Screenshot>
      <img alt="" src="/stake.png" />
    </Screenshot>
  </Item>
);

const TakingPart4: FC<{}> = () => (
  <Item title="Do some laps">
    <P>
      Earn MTA rewards on a second by second basis, in addition to any third
      party tokens like BAL that may be up for grabs.
    </P>
    <Screenshot>
      <img alt="" src="/pool.png" />
    </Screenshot>
  </Item>
);

const TakingPart5: FC<{}> = () => (
  <Item title="Dry off">
    <P>Claim your rewards or withdraw your stake at any time!</P>
    <Screenshot>
      <img alt="" src="/claim.png" />
    </Screenshot>
  </Item>
);

const PoolCardsContainer = styled.div`
  height: 300px;
  text-align: left;

  > div > div > div {
    margin: 0 auto;
    width: 360px;

    > section {
      padding: 0 8px;
    }
  }
`;

const PoolCards: FC<{}> = () => {
  const stakingRewardContracts = useStakingRewardsContracts();

  // As this is the last item, set LocalStorage
  useEffect(() => {
    LocalStorage.set('viewedEarnOnboarding', true);
  }, []);

  const [, setSwipeDisabled] = useSwipeDisabled();

  return (
    <Item title="Earn Meta rewards" slider>
      <H3>Select a pool to start earning.</H3>
      <PoolCardsContainer>
        <Slider
          setSwipeDisabled={setSwipeDisabled}
          items={Object.keys(stakingRewardContracts).map(address => ({
            children: <Card address={address} linkToPool />,
            key: address,
          }))}
        />
      </PoolCardsContainer>
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
    slider: true,
    children: <PoolCards />,
  },
];

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top right, #040a10, #131212);
  flex: 1;
  > * {
    flex: 1;
  }
`;

const Intro = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;

  h2 {
    font-size: ${FontSize.xl};
  }

  ${MtaToken} {
    padding: 0;

    > img {
      width: 96px;
      height: 96px;
    }

    > img + div {
      display: none;
    }
  }
`;

const Content = styled.div`
  padding: 8px;
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

const EarnSlider: FC<{
  toggleOnboardingVisible(): void;
}> = ({ toggleOnboardingVisible }) => {
  const [swipeDisabled] = useSwipeDisabled();
  return (
    <Slider
      items={EARN_ITEMS}
      bottomControls
      sideControls
      swipeDisabled={swipeDisabled}
      skipButton={
        <Button onClick={toggleOnboardingVisible} size={Size.s}>
          Skip introduction
        </Button>
      }
    />
  );
};

export const Earn: FC<{}> = () => {
  const viewedEarnOnboarding = !!LocalStorage.get('viewedEarnOnboarding');
  const [onboardingVisible, toggleOnboardingVisible] = useToggle(
    !viewedEarnOnboarding,
  );

  return (
    <Container>
      {onboardingVisible ? (
        <SwipeDisabledProvider>
          <SliderContainer>
            <EarnSlider toggleOnboardingVisible={toggleOnboardingVisible} />
          </SliderContainer>
        </SwipeDisabledProvider>
      ) : (
        <Content>
          <div>
            <Intro>
              <MtaToken symbol="MTA" />
              <div>
                <H2>EARN</H2>
                <H3>Ecosystem rewards with mStable</H3>
                <Button onClick={toggleOnboardingVisible} size={Size.xs}>
                  View introduction
                </Button>
              </div>
            </Intro>
            <PoolsOverview />
          </div>
        </Content>
      )}
    </Container>
  );
};
