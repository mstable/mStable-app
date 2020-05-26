import React, { FC, useLayoutEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as DaiSvg } from '../../icons/DAI.svg';
import { ReactComponent as TusdSvg } from '../../icons/TUSD.svg';
import { ReactComponent as UsdcSvg } from '../../icons/USDC.svg';
import { ReactComponent as UsdtSvg } from '../../icons/USDT.svg';
import { ReactComponent as MusdSvg } from '../../icons/mUSD-circle.svg';
import { ReactComponent as CompoundSvg } from '../../icons/compound.svg';
import { ReactComponent as AaveSvg } from '../../icons/aave.svg';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { useIncreasingNumber } from '../../../web3/hooks';

const strokeAnimation = keyframes`
  0% {
    stroke-dashoffset: 50%;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const Container = styled.svg<{ forwards: boolean }>`
  text {
    text-anchor: middle;
  }

  tspan {
    font-family: 'Poppins-Bold', sans-serif;
    font-size: 18px;
  }

  #lines {
    line {
      stroke: #c7c7c7;
      stroke-dasharray: 8px, 4px;
      stroke-width: 4px;
      animation: ${strokeAnimation} 3s linear infinite
        ${({ forwards }) => (forwards ? 'forwards' : 'reverse')};
    }
  }

  #save-circle {
    circle {
      fill: none;
      stroke: #c7c7c7;
      stroke-dasharray: 8px, 4px;
      stroke-width: 4px;
      animation: ${strokeAnimation} 3s linear infinite forwards;
    }
  }
`;

const CountUpContainer = styled.tspan`
  ${({ theme }) => theme.mixins.numeric}
`;

const startMintValues = {
  musd: 0,
  dai: 100,
  usdc: 100,
  usdt: 50,
  tusd: 25,
};

const endMintValues = {
  musd: 275,
  dai: 0,
  usdc: 0,
  usdt: 0,
  tusd: 0,
};

const startSwapValues = {
  dai: 100,
  usdt: 0,
};

const endSwapValues = {
  dai: 0,
  usdt: 100,
};

const CountUp: typeof CountUpBase = ({ end, decimals = 0, duration = 4 }) => (
  <CountUpBase
    end={end}
    container={CountUpContainer}
    duration={duration}
    decimals={decimals}
  />
);

export const MintAnimation: FC<{ forwards: boolean }> = ({ forwards }) => {
  const [animate, setAnimate] = useState<boolean>(forwards);

  useLayoutEffect(() => {
    const i = setInterval(() => {
      setAnimate(!animate);
    }, 5000);
    return () => clearInterval(i);
  }, [animate, setAnimate]);

  const { dai, musd, tusd, usdc, usdt } = animate
    ? startMintValues
    : endMintValues;

  return (
    <Container viewBox="0 0 290 230" forwards={forwards}>
      <g transform={forwards ? '' : 'translate(0 190)'}>
        <text>
          <tspan x="22" y="15">
            DAI
          </tspan>
          <tspan x="22" y="35">
            <CountUp end={dai} container={CountUpContainer} />
          </tspan>
        </text>
        <text>
          <tspan x="100" y="15">
            USDC
          </tspan>
          <tspan x="100" y="35">
            <CountUp end={usdc} container={CountUpContainer} />
          </tspan>
        </text>
        <text>
          <tspan x="176" y="15">
            USDT
          </tspan>
          <tspan x="176" y="35">
            <CountUp end={usdt} container={CountUpContainer} />
          </tspan>
        </text>
        <text>
          <tspan x="252" y="15">
            TUSD
          </tspan>
          <tspan x="252" y="35">
            <CountUp end={tusd} container={CountUpContainer} />
          </tspan>
        </text>
      </g>
      <g transform={forwards ? '' : 'translate(0 -192)'}>
        <text>
          <tspan x="138" y="210">
            mUSD
          </tspan>
          <tspan x="138" y="230">
            <CountUp end={musd} container={CountUpContainer} />
          </tspan>
        </text>
      </g>
      <g id="lines" transform={forwards ? '' : 'rotate(180 138 110)'}>
        <line x1="20.781" y1="68.854" x2="137.258" y2="163.163" />
        <line x1="98.803" y1="68.854" x2="135.357" y2="158.379" />
        <line x1="175.406" y1="68.854" x2="139.19" y2="161.053" />
        <line x1="251.072" y1="68.854" x2="139.19" y2="163.163" />
      </g>
      <g transform={forwards ? '' : 'translate(0 95)'}>
        <UsdtSvg x="154" y="46" width="44" height="44" />
        <UsdcSvg x="78" y="46" width="44" height="44" />
        <TusdSvg x="230" y="46" width="44" height="44" />
        <DaiSvg x="1" y="46" width="44" height="44" />
      </g>
      <g transform={forwards ? '' : 'translate(0 -85)'}>
        <MusdSvg x="107" y="128" width="60" height="60" />
      </g>
    </Container>
  );
};

export const SwapAnimation: FC<{}> = () => {
  const [animate, setAnimate] = useState<boolean>(true);

  useLayoutEffect(() => {
    const i = setInterval(() => {
      setAnimate(!animate);
    }, 5000);
    return () => clearInterval(i);
  }, [animate, setAnimate]);

  const { dai, usdt } = animate ? startSwapValues : endSwapValues;

  return (
    <Container viewBox="0 0 290 230" forwards>
      <text>
        <tspan x="138" y="15">
          DAI
        </tspan>
        <tspan x="138" y="35">
          <CountUp end={dai} container={CountUpContainer} />
        </tspan>
      </text>
      <text>
        <tspan x="138" y="210">
          USDT
        </tspan>
        <tspan x="138" y="230">
          <CountUp end={usdt} container={CountUpContainer} />
        </tspan>
      </text>
      <g id="lines">
        <line x1="137.258" y1="68.854" x2="137.258" y2="163.163" />
      </g>
      <UsdtSvg x="107" y="46" width="44" height="44" />
      <DaiSvg x="107" y="128" width="44" height="44" />
    </Container>
  );
};

export const SaveAnimation: FC<{}> = () => {
  const [animate, setAnimate] = useState<boolean>(true);

  const savingsBalanceIncreasing = useIncreasingNumber(105, 0.000001, 100);

  useLayoutEffect(() => {
    const i = setInterval(() => {
      setAnimate(!animate);
    }, 5000);
    return () => clearInterval(i);
  }, [animate, setAnimate]);

  return (
    <Container viewBox="0 0 290 230" forwards>
      <text>
        <tspan x="155" y="120">
          <CountUp
            end={savingsBalanceIncreasing as number}
            decimals={8}
            duration={0}
            container={CountUpContainer}
          />
        </tspan>
      </text>
      <g id="save-circle">
        <circle r="90" cx="155" cy="115" />
      </g>
      <MusdSvg x="125" y="0" width="60" height="60" />
      <CompoundSvg x="40" y="160" width="165" height="60" />
      <AaveSvg x="190" y="144" width="60" height="60" />
    </Container>
  );
};
