import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { H2, H3, P } from '../core/Typography';
import { ExternalLink } from '../core/ExternalLink';

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
    <H2>Frequently Asked Questions</H2>
    <div>
      <H3>Getting started</H3>
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
              <Link to="/mint">Mint</Link> mUSD with your stablecoins
            </li>
            <li>
              <Link to="/save">Save</Link> your mUSD to earn our native interest
              rate
            </li>
            <li>
              <Link to="/earn">Earn</Link> ecosystem rewards by contributing
              liquidity
            </li>
            <li>
              <Link to="/swap">Swap</Link> stablecoins with zero slippage
            </li>
            <li>
              <Link to="/redeem">Redeem</Link> your mUSD for the underlying
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
      <H3>Mint</H3>
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
      <H3>Earn</H3>
      <List>
        <ListItem>
          <P>What is EARN?</P>
          <P>
            EARN consolidates all of mStable's incentivised liquidity pools into
            one place, and lets anyone track their Meta rewards in real time.
          </P>
          <P>
            Rewards are distributed to users contributing to these pools at a
            rate proportionate to their share of the pool, and the rewards made
            available to the pool.
          </P>
          <P>
            The goal of this liquidity provision is to increase the utility of
            mStable assets and to grow the ecosystem.
          </P>
        </ListItem>
        <ListItem>
          <P>How can I earn ecosystem rewards with mStable?</P>
          <P>
            To earn ecosystem rewards, contribute liquidity to one of the
            Balancer or Uniswap pools available on <Link to="/earn">EARN</Link>.
          </P>
          <P>
            Each pool comprises a set of collateral tokens based on a ratio;
            e.g. a pool with mUSD/USDC in a 50:50 ratio has a total collateral
            made up half mUSD and half USDC.
          </P>
          <P>
            To contribute liquidity to a pool, simply add collateral to it on
            the platform it is run on (e.g. Balancer or Uniswap). The platform
            will send in return a staking token (e.g. BPT or UNI-V2) that is
            specific to the pool, and records your contribution of collateral.
          </P>
          <P>
            These tokens can be staked on the pool page on EARN, and will
            immediately start earning rewards while they are staked.
          </P>
        </ListItem>
        <ListItem>
          <P>How do I join a Balancer pool?</P>
          <P>
            Firstly go to the Balancer pool you want to contribute to on EARN,
            and then open up the link to Balancer on the pool card at the top.
          </P>
          <P>
            <ExternalLink href="https://defitutorials.substack.com/p/adding-liquidity-to-balancer-pools">
              This guide
            </ExternalLink>{' '}
            provides detailed instructions for how to contribute liquidity to a
            Balancer pool.
          </P>
        </ListItem>
        <ListItem>
          <P>How do I join a Uniswap pool?</P>
          <P>
            Firstly go to the Uniswap pool you want to contribute to on EARN,
            and then open up the link to Uniswap on the pool card at the top.
          </P>
          <P>
            <ExternalLink href="https://blog.mainframe.com/tutorial-adding-liquidity-to-uniswap-v2-2bb641f2bbc0">
              This guide
            </ExternalLink>{' '}
            provides detailed instructions for how to contribute liquidity to a
            Uniswap pool.
          </P>
        </ListItem>
        <ListItem>
          <P>When do I get my rewards?</P>
          <P>
            As long as there are rewards available in the pool, and you have
            staked tokens in the pool, rewards will be earned in real time.
            These rewards can be claimed at any time and sent to your wallet.
          </P>
        </ListItem>
        <ListItem>
          <P>When are new rewards made available?</P>
          <P>
            New rewards are being made available on a weekly basis for currently
            running pools.
          </P>
        </ListItem>
        <ListItem>
          <P>What's the best pool to join?</P>
          <P>This depends on a number of factors:</P>
          <ul>
            <li>
              Total collateral value (smaller pools may present a better
              opportunity, but this depends on the rewards available)
            </li>
            <li>APY/ROI of the pool</li>
            <li>Your available collateral</li>
            <li>
              Impermanent loss (stablecoin-only pools inherently present less
              risk than those with volatile tokens)
            </li>
          </ul>
        </ListItem>
        <ListItem>
          <P>How do I earn and claim BAL rewards?</P>
          <P>
            When made available to the pool, BAL rewards are earned in the same
            way as MTA rewards, and can be claimed in the same way; the earned
            BAL balance is shown beneath the earned MTA.
          </P>
        </ListItem>
        <ListItem>
          <P>How do I exit a pool and get my tokens back?</P>
          <P>
            Simply click on the 'EXIT' tab on the pool and send the transaction;
            this will return your staked tokens from the pool, and claim any
            earned rewards to your wallet.
          </P>
        </ListItem>
        <ListItem>
          <P>When can I stake MTA?</P>
          <P>
            Contributing MTA in one of the MTA incentivised liquidity pools is
            the closest thing we have to MTA staking at this stage. The team
            will announce details about MTA staking and governance in due
            course.
          </P>
        </ListItem>
        <ListItem>
          <P>What is impermanent loss?</P>
          <P>
            Pools with volatile tokens may suffer from impermanent loss, which
            is explained in detail{' '}
            <ExternalLink href="https://medium.com/dragonfly-research/what-explains-the-rise-of-amms-7d008af1c399">
              here
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink href="https://cryptobriefing.com/how-to-yield-farm-uniswap-not-get-rekt/">
              here
            </ExternalLink>
            .
          </P>
        </ListItem>
        <ListItem>
          <P>Do I need to pay any fees?</P>
          <P>There are no fees (excluding gas) for interacting with EARN.</P>
        </ListItem>
        <ListItem>
          <P>
            Why am I not seeing my share of the pool in Balancer after joining
            EARN?
          </P>
          <P>
            When staking, your Balancer Pool Token (BPT) is deposited into a
            staking rewards contract so that it can be locked while rewards are
            earned and distributed. Exiting the pool will return this token, and
            your share will then be shown in Balancer.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3>Save</H3>
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
      <H3>Swap</H3>
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
      <H3>Redeem</H3>
      <List>
        <ListItem>
          <P>How do I redeem mUSD for an underlying stablecoin?</P>
          <P>
            You can redeem your mUSD at any time for the basket of underlying
            stablecoins that it represents. All that you need to do this is to
            navigate to the Redeem section of our app, choose the amount of mUSD
            you wish to redeem, and go. The amounts of underlying stablecoins
            you receive will be automatically paid out at the current basket
            weight ratios with a fee subtracted. This fee is in place to avoid
            gaming of the SWAP mechanism that benefits all savers.
          </P>
          <P>
            In future, we will introduce functionality allowing custom
            redemption with selections of USD stablecoins. As with minting and
            swapping in our system, these redemptions will be subject to “max
            weight” rules.
          </P>
        </ListItem>
      </List>
    </div>
    <div>
      <H3>More</H3>
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
