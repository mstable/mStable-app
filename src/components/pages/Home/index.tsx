import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { H2, P } from '../../core/Typography';
import { centredLayout } from '../../layout/css';
import { Size } from '../../../theme';
import { Footer } from '../../layout/Footer';
import { MintAnimation } from './Animation';

const HeroText = styled(H2)`
  font-weight: bold;
  font-size: 36px;
  line-height: 1.3em;
  padding-bottom: 50px;

  > span {
    color: ${({ theme }) => theme.color.white};
  }
`;

const CTA = styled(A)`
  padding-top: 50px;
  font-size: 24px;
  font-weight: bold;
`;

const Symbol = styled.div<{ active: boolean }>`
  font-weight: bold;
  display: flex;
  align-items: center;
  height: 80px;
  color: ${({ theme, active }) =>
    active ? theme.color.black : theme.color.gold};
  cursor: pointer;

  div {
    font-size: 24px;
    text-transform: lowercase;
  }

  i {
    font-size: 60px;
    font-style: normal;
    text-align: center;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    height: 100px;
    div {
      font-size: 36px;
    }
    i {
      font-size: 120px;
    }
  }
`;

const Symbols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 40px;

  ${Symbol} {
    &:nth-child(odd) {
      justify-content: flex-end;
      div {
        margin-right: 16px;
      }
    }
    &:nth-child(even) {
      justify-content: flex-start;
      i {
        order: 1;
      }
      div {
        order: 2;
        margin-left: 16px;
      }
    }
  }
`;

const SymbolsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0;
  user-select: none;
`;

const Block = styled.div`
  border-left: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  padding-left: 20px;
`;

const Section = styled.section`
  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 8px;
  }
`;

const CentredLayout = styled.div`
  display: block !important;
  padding-left: 16px;
  padding-right: 16px;
  ${centredLayout}
`;

const FeaturesLayout = styled(CentredLayout)`
  padding-bottom: 300px; // For the benefit of the 'Learn more' link etc
`;

const Intro = styled.div`
  padding: 100px 0;
  background: ${({ theme }) => theme.color.gold};
  a {
    color: black;
    display: block;
  }
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  > * {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  // The sticky header won't always be 80px, so this is less than ideal
  min-height: calc(100vh - 80px);

  align-items: flex-start;
  height: calc(100vh - 80px);
  color: black;
`;

const features: { symbol: string; title: string; children: JSX.Element }[] = [
  {
    symbol: '+',
    title: 'Mint',
    children: (
      <>
        <Block>
          <MintAnimation />
        </Block>
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
    symbol: '×',
    title: 'Save',
    children: (
      <>
        <Block>
          <P>Save graphic goes here</P>
        </Block>
        <Block>
          <P>
            mStable assets can also be deposited to earn interest through the
            mStable Savings Contract, just like you would with a savings
            account, with each mStable asset balance accruing interest earned
            across the entire DeFi ecosystem.
          </P>
          <P>
            <A href="/save">Go to save</A>
          </P>
        </Block>
      </>
    ),
  },
  {
    symbol: '=',
    title: 'Swap',
    children: (
      <>
        <Block>
          <P>Swap graphic goes here</P>
        </Block>
        <Block>
          <P>
            mStable assets are created by swapping any accepted tokenized asset
            for the corresponding mStable asset. Our first asset, mUSD, is
            created by depositing USDC, DAI, TUSD or USDT at a 1:1 ratio.
          </P>
          <P>
            <A href="/swap">Go to swap</A>
          </P>
        </Block>
      </>
    ),
  },
  {
    symbol: '-',
    title: 'Redeem',
    children: (
      <>
        <Block>
          {/* TODO this should be the opposite of mint */}
          <MintAnimation />
        </Block>
        <Block>
          <P>You can redeem mUSD for the underlying stablecoins at any time.</P>
          <P>
            <A href="/redeem">Go to redeem</A>
          </P>
        </Block>
      </>
    ),
  },
];

export const Home: FC<{}> = () => {
  const [feature, setFeature] = useState(0);
  return (
    <Container>
      <Content>
        <Intro>
          <CentredLayout>
            <Section>
              <HeroText>
                mStable makes stablecoins{' '}
                <span>easy, robust and profitable.</span>
              </HeroText>
              <Block>
                <P size={Size.l}>
                  mStable unifies stablecoins, lending and swapping into one
                  standard.
                </P>
                <P>
                  <CTA href="/mint">Get started</CTA>
                  or
                  <a href="#learn-more">Learn more</a>
                </P>
              </Block>
            </Section>
          </CentredLayout>
        </Intro>
        <FeaturesLayout>
          <SymbolsContainer id="learn-more">
            <Symbols>
              {features.map(({ symbol, title }, index) => (
                <Symbol
                  active={feature === index}
                  onClick={() => setFeature(index)}
                  key={symbol}
                >
                  <div>{title}</div>
                  <i>{symbol}</i>
                </Symbol>
              ))}
            </Symbols>
          </SymbolsContainer>
          <Section>{features[feature].children}</Section>
        </FeaturesLayout>
      </Content>
      <CentredLayout>
        <Footer inverted={false} />
      </CentredLayout>
    </Container>
  );
};
