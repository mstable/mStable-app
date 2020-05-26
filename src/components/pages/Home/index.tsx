import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { H2, H3, P } from '../../core/Typography';
import { centredLayout } from '../../layout/css';
import { Footer } from '../../layout/Footer';
import { ReactComponent as LogoSvg } from '../../icons/mstable-logo-horizontal.svg';
import { MintAnimation, SaveAnimation, SwapAnimation } from './Animation';

const Logo = styled(LogoSvg)`
  max-width: 50%;
  padding-bottom: 40px;
`;

const CTA = styled(A)`
  display: inline-block;
  margin: 40px 0;
  padding: 20px;
  background: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 2px;
  box-shadow: 0 1.6px 1.3px rgba(0, 0, 0, 0.1),
    0 4.2px 5.4px rgba(0, 0, 0, 0.065), 0 9.3px 16.4px rgba(0, 0, 0, 0.05),
    0 32px 64px rgba(0, 0, 0, 0.035);
`;

const Symbol = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  height: 80px;
  color: ${({ theme }) => theme.color.black};

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
  padding: 20px;

  ${P} {
    font-size: ${({ theme }) => theme.fontSize.l};
  }
  
  ${H3} {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

const Section = styled.section`
  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 8px;
  }
`;

const Lead = styled(Section)`
  ${H2} {
    font-size: 36px;
    line-height: 1.3em;
    padding-bottom: 50px;
    color: white;
    font-weight: bold;
  }
  
  ${Block} {
    padding-left: 0;
    padding-right: 0;
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

const Feature = styled.div`
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 128px;
  border-radius: 2px;
  box-shadow: 0 1.6px 1.3px rgba(0, 0, 0, 0.1),
    0 4.2px 5.4px rgba(0, 0, 0, 0.065), 0 9.3px 16.4px rgba(0, 0, 0, 0.05),
    0 32px 64px rgba(0, 0, 0, 0.035);

  > * {
    padding: 20px;
  }

  > a {
    display: flex;
    justify-content: center;
  }
`;

const Intro = styled.div`
  padding: 100px 0;
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
  align-items: flex-start;
  background: ${({ theme }) => theme.color.gold};
  color: ${({ theme }) => theme.color.offBlack};

  a {
    color: ${({ theme }) => theme.color.offBlack};
  }
`;

const features: {
  symbol: string;
  title: string;
  href: string;
  children: JSX.Element;
}[] = [
  {
    symbol: '+',
    title: 'Mint',
    href: '/mint',
    children: (
      <>
        <Block>
          <MintAnimation forwards />
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
    href: '/save',
    children: (
      <>
        <Block>
          <SaveAnimation />
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
    href: '/swap',
    children: (
      <>
        <Block>
          <SwapAnimation />
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
    href: '/redeem',
    children: (
      <>
        <Block>
          <MintAnimation forwards={false} />
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

export const Home: FC<{}> = () => (
  <Container>
    <Content>
      <Intro>
        <CentredLayout>
          <Logo title="mStable" />
          <Lead>
            <Block>
              <H2>Robust, easy and profitable stablecoins</H2>
            </Block>
            <Block>
              <H3>
                mStable unifies stablecoins, lending and swapping into one
                standard.
              </H3>
              <CTA href="/mint">Go to app</CTA>
            </Block>
          </Lead>
        </CentredLayout>
      </Intro>
      <FeaturesLayout>
        {features.map(({ symbol, title, href, children }) => (
          <Feature key={symbol}>
            <A href={href}>
              <Symbol>
                <div>{title}</div>
                <i>{symbol}</i>
              </Symbol>
            </A>
            <Section>{children}</Section>
          </Feature>
        ))}
      </FeaturesLayout>
    </Content>
    <CentredLayout>
      <Footer inverted={false} />
    </CentredLayout>
  </Container>
);
