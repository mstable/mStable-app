import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import useToggle from 'react-use/lib/useToggle';
import createStateContext from 'react-use/lib/createStateContext';

import {
  EarnDataProvider,
  useStakingRewardsContracts,
} from '../../../context/earn/EarnDataProvider';
import { Slider } from '../../core/Slider';
import { Token } from '../../core/Token';
import { H3, P } from '../../core/Typography';
import { Button } from '../../core/Button';
import { ExternalLink } from '../../core/ExternalLink';
import { Color, FontSize } from '../../../theme';
import { LocalStorage } from '../../../localStorage';
import { PageAction, PageHeader } from '../PageHeader';
import { PoolsOverview } from './PoolsOverview';
import { Card } from './Card';
import { MerkleDropClaims } from './MerkleDropClaims';
import { CurveProvider } from '../../../context/earn/CurveProvider';

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

const VideoContainer = styled.div`
  border-radius: 4px;
  overflow: hidden;
  box-shadow: ${Color.blackTransparent} 0 8px 12px;

  video {
    width: 100%;
    max-width: 500px;
    height: auto;
    display: block;
  }
`;

const Video: FC<{ webm: string; mp4: string }> = ({ webm, mp4 }) => (
  <VideoContainer>
    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
    <video autoPlay loop>
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  </VideoContainer>
);

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
  > :first-child {
    width: 64px;
    height: 64px;
    padding-right: 8px;
  }
`;

const IntroducingMetaHeader = styled.div`
  padding-bottom: 32px;

  ${MtaToken} {
    justify-content: center;
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
      <IntroducingMetaHeader>
        <MtaToken symbol="MTA" color={Color.white} />
        <H3>Introducing Meta.</H3>
      </IntroducingMetaHeader>
      <P>
        Meta (MTA) is mStable's protocol token. Meta will have at least three
        core functions:
      </P>
      <ol>
        <li>
          To act as the ultimate source of re-collateralisation (insurance) for
          mASSETS.
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
    <P>
      mStable are rewarding users in MTA for contributing to mStable's liquidity
      across the DeFi ecosystem. View the list of incentivised pools and
      platforms and choose those you would like to contribute to!
    </P>
    <Video webm="/media/01-overview.webm" mp4="/media/01-overview.mp4" />
  </Item>
);

const TakingPart2: FC<{}> = () => (
  <Item title="Test the waters">
    <div>
      <P>
        Contribute liquidity to the chosen pool by visiting the dApp and
        depositing the required assets.
      </P>
      <P>
        Platforms like Balancer or Uniswap will issue an ERC-20 LP (Liquidity
        Provider) token for your contribution.
      </P>
    </div>
    <Video webm="/media/02-balancer.webm" mp4="/media/02-balancer.mp4" />
  </Item>
);

const TakingPart3: FC<{}> = () => (
  <Item title="Dive in">
    <P>
      "Stake" this LP token on the mStable EARN page by simply entering an
      amount, approving the spending of the LP token and then pressing "STAKE".
    </P>
    <Video webm="/media/03-staking.webm" mp4="/media/03-staking.mp4" />
  </Item>
);

const TakingPart4: FC<{}> = () => (
  <Item title="Do some laps">
    <P>
      Earn MTA rewards on a second by second basis, in addition to any third
      party tokens like BAL that may be up for grabs.
    </P>
    <Video webm="/media/04-rewards.webm" mp4="/media/04-rewards.mp4" />
  </Item>
);

const TakingPart5: FC<{}> = () => (
  <Item title="Dry off">
    <P>Claim your rewards or withdraw your stake at any time!</P>
    <Video webm="/media/05-claiming.webm" mp4="/media/05-claiming.mp4" />
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
      > div {
        cursor: grab;
      }
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
          items={Object.keys(stakingRewardContracts)
            .filter(address => !stakingRewardContracts[address].expired)
            .map(address => ({
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
  border-radius: 1rem;
  background: linear-gradient(to top right, #040a10, #131212);
  margin-top: 2rem;
  flex: 1;
  > * {
    flex: 1;
  }
  > div > div {
    position: relative;
  }
`;

const MerkleClaims = styled(MerkleDropClaims)`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;

const Content = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
        <Button onClick={toggleOnboardingVisible}>Skip introduction</Button>
      }
    />
  );
};

const EarnContent: FC = () => {
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
          <PageHeader
            action={PageAction.Earn}
            subtitle="Ecosystem rewards with mStable"
          />
          <MerkleClaims />
          <PoolsOverview />
        </Content>
      )}
    </Container>
  );
};

export const Earn: FC = () => (
  <CurveProvider>
    <EarnDataProvider>
      <EarnContent />
    </EarnDataProvider>
  </CurveProvider>
);
