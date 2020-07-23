import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';
import { H2, H3, P } from '../core/Typography';

const List = styled.ul`
  padding-bottom: 32px;
`;

const ListItem = styled.li`
  > :first-child {
    font-weight: bold;
  }

  padding-bottom: 32px;
`;

const Container = styled.div`
  ${H2} {
    padding-bottom: 32px;
  }

  ${H3} {
    padding-bottom: 16px;
  }

  ul li {
    padding-bottom: 8px;
  }
`;

export const FAQ: FC<{}> = () => (
  <Container>
    <H2 borderTop>Frequently Asked Questions</H2>
    <div>
      <H3 borderTop>Getting started</H3>
      <List>
        <ListItem>
          <P>What is mStable?</P>
          <P>
            mStable is a project that unites stablecoins, lending and swapping
            into one standard.
          </P>
          <P>
            You can read more on the{' '}
            <a
              href="https://mstable.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              mStable website
            </a>{' '}
            and our in docs.
          </P>
        </ListItem>
        <ListItem>
          <P>What can I do with the mStable app?</P>
          <ul>
            <li>
              <A href="/mint">Mint</A> mUSD with your stablecoins
            </li>
            <li>
              <A href="/save">Save</A> your mUSD to earn our native interest
              rate
            </li>
            <li>
              <A href="/swap">Swap</A> stablecoins with zero slippage
            </li>
            <li>
              <A href="/redeem">Redeem</A> your mUSD for the underlying
              collateral
            </li>
          </ul>
        </ListItem>
        <ListItem>
          <P>What do I need to get started?</P>
          <P>
            You need an Ethereum wallet (for example,{' '}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>{' '}
            and some stablecoins, e.g.{' '}
            <a
              href="https://oasis.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              DAI
            </a>
            , or{' '}
            <a
              href="https://www.coinbase.com/usdc"
              target="_blank"
              rel="noopener noreferrer"
            >
              USDC
            </a>
            ).
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3 borderTop>Mint</H3>
      <List>
        <ListItem>
          <P>How do I mint mUSD?</P>
          <P>
            Anyone can use one or a combination of accepted USD stablecoins
            (currently DAI, TUSD, USDT, and USDC) to mint mUSD. Simply access
            the mStable app with a Web3 wallet, approve the stablecoins you wish
            to use (this is a one time transaction), and specify the amount of
            mUSD you wish to create. Make sure you have the required balance of
            stablecoins you wish to use, and you’re away!
          </P>
          <P>
            In certain cases, you will only be allowed to “multimint” with
            multiple stablecoins instead of using one specific asset. This only
            occurs when one of our underlying stablecoins has hit its “max
            weight”, a safety limit we’ve imposed on the system to protect it.
            If this is the case, you will see a notification on the app clearly
            stating that a “max weight” has been hit. These scenarios are
            temporary, and will change as stablecoin values fluctuate.
          </P>
          <P>
            In future, we will allow users to mint mUSD using other crypto
            assets such as ETH.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3 borderTop>Save</H3>
      <List>
        <ListItem>
          <P>How do I earn a yield on my mUSD balance?</P>
          <P>
            Anyone wishing to earn an APY on their mUSD balance can do so by
            locking their mUSD in the mStable Savings Contract. To do this,
            navigate to the Save section of the app with a Web3 browser, unlock
            deposits (a one time transaction), specify the amount of mUSD you
            wish to save, and go! You’ll be able to see the interest being earnt
            on your balance in real time. Once this is done, interest is
            automatically accrued and distributed to you, and is available to be
            withdrawn at any time.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3 borderTop>Swap</H3>
      <List>
        <ListItem>
          <P>How do I use mStable to swap stablecoins?</P>
          <P>
            Anyone wishing to swap one of our underlying stablecoins for another
            can do so without incurring any slippage on their order. Navigate to
            our Swap section within the app, choose the amount and what USD
            stablecoins you wish to swap. We charge a fixed BPS fee, which is
            the same regardless of order size, so you can be confident that
            prices won’t change on you.
          </P>
          <P>
            As with minting, there are certain temporary instances where swaps
            on mStable will be limited. This will only occur when any attempted
            swap pushes an underlying stablecoin past its designated “max
            weight”. In these cases, the user must wait for the system to
            change, or swap using another pair that is available.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3 borderTop>Redeem</H3>
      <List>
        <ListItem>
          <P>How do I redeem mUSD for an underlying stablecoin?</P>
          <P>
            You can redeem your mUSD at any time for the basket of underlying
            stablecoins that it represents. All that you need to do
            this is to navigate to the Redeem section of our app, choose the
            amount of mUSD you wish to redeem, and go. The amounts of underlying
            stablecoins you receive will be automatically paid out at the
            current basket weight ratios with a fee subtracted. This fee
            is in place to avoid gaming of the SWAP mechanism that benefits all
            savers.
          </P>
          <P>
            In future, we will introduce functionality allowing custom redemption with
            selections of USD stablecoins. As with minting and swapping in
            our system, these redemptions will be subject to “max weight” rules.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3 borderTop>More</H3>
      <P>Still have questions? Please contact us via:</P>
      <ul>
        <li>
          <a
            href="https://discord.gg/pgCVG7e"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </li>
        <li>
          <a href="mailto:info@mstable.org">Email</a>
        </li>
      </ul>
    </div>
  </Container>
);
