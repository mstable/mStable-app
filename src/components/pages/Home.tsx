import React, { FC } from 'react';
import styled from 'styled-components';
import { H2, Linkarooni, P } from '../core/Typography';
import { ViewportWidth } from '../../theme';
import logoSVG from '../icons/mstable-logo-horizontal.svg';

const Section = styled.section`
  padding-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${ViewportWidth.m}) {
    width: 75%;
  }
`;

const Logo = styled.img`
  max-width: 300px;
  height: auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

/**
 * Placeholder component for Home.
 */
export const Home: FC<{}> = () => (
  <div>
    <Logo title="mStable" src={logoSVG} />
    <Section>
      <H2>What is mStable?</H2>
      <P>
        mStable is driven to make tokenized assets easy, safe and profitable.
      </P>
      <P>
        mStable does this by uniting tokenized assets and lending platforms into
        one standard and that is more safe and useful than the sum of its parts.
      </P>
      <P>
        Our first products are mUSD and the mUSD Savings Contract. Anyone can
        create an mUSD, take advantage of mUSD’s native interest rate and earn
        the Meta token for contributing to mUSD’s utility and growth.
      </P>
    </Section>
    <Section>
      <H2>Swap</H2>
      <P>
        mStable assets are created by swapping any accepted tokenized asset for
        the corresponding mStable asset. Our first asset, mUSD, is created by
        depositing USDC, DAI, TUSD or USDT at a 1:1 ratio.
      </P>
      <Linkarooni href="/swap">Swap assets</Linkarooni>
    </Section>
    <Section>
      <H2>Save</H2>
      <P>
        mStable assets can also be deposited to earn interest through the
        mStable Savings Contract, just like you would with a savings account,
        with each mStable asset balance accruing interest earned across the
        entire DeFi ecosystem.
      </P>
      <Linkarooni href="/save">Save with mUSD</Linkarooni>
    </Section>
    <Section>
      <H2>Earn</H2>
      <P>
        mStable rewards those who contribute to its utility and growth. Whether
        that’s by swapping stablecoins for mStable assets, staking MTA to
        participate in the system’s governance, or contributing to mStable
        liquidity pools on Uniswap, we want anyone to feel like they can share
        in the growth of the platform over the long term.
      </P>
    </Section>
    <Section>
      <H2>Safe</H2>
      <P>
        We built mStable with safety in mind from day one. mStable assets draw
        their value from diversified collateral, making them resilient to
        failures within individual stablecoins. In addition to this, mStable
        assets are protected by multiple backstop and fail safe measures, which
        are automatically triggered in the event of an emergency. Behind all
        this, the Meta token will soon stand as the system’s ultimate backstop.
      </P>
    </Section>
  </div>
);
