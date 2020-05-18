import React, { FC, useLayoutEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as DaiSvg } from '../../icons/DAI.svg';
import { ReactComponent as TusdSvg } from '../../icons/TUSD.svg';
import { ReactComponent as UsdcSvg } from '../../icons/USDC.svg';
import { ReactComponent as UsdtSvg } from '../../icons/USDT.svg';
import { ReactComponent as MusdSvg } from '../../icons/mUSD-circle.svg';
import { CountUp as CountUpBase } from '../../core/CountUp';

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
`;

const CountUpContainer = styled.tspan`
  ${({ theme }) => theme.mixins.numeric}
`;

const startValues = {
  mUsd: 0,
  dai: 100,
  usdc: 100,
  usdt: 50,
  tusd: 25,
};

const endValues = {
  mUsd: 275,
  dai: 0,
  usdc: 0,
  usdt: 0,
  tusd: 0,
};

const CountUp: typeof CountUpBase = ({ end }) => (
  <CountUpBase
    end={end}
    container={CountUpContainer}
    duration={1}
    decimals={0}
  />
);

export const MintAnimation: FC<{}> = () => {
  const [animate, setAnimate] = useState<boolean>(true);

  useLayoutEffect(() => {
    setInterval(() => {
      setAnimate(!animate);
    }, 3000);
  }, [animate, setAnimate]);

  const { dai, mUsd, tusd, usdc, usdt } = animate ? startValues : endValues;

  return (
    <Container width="290" height="230" forwards={animate}>
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
      <text>
        <tspan x="140" y="205">
          mUSD
        </tspan>
        <tspan x="140" y="225">
          <CountUp end={mUsd} container={CountUpContainer} />
        </tspan>
      </text>
      <g id="lines">
        <line x1="20.781" y1="68.854" x2="137.258" y2="163.163" />
        <line x1="98.803" y1="68.854" x2="135.357" y2="158.379" />
        <line x1="175.406" y1="68.854" x2="139.19" y2="161.053" />
        <line x1="251.072" y1="68.854" x2="139.19" y2="163.163" />
      </g>
      <UsdtSvg x="154" y="46" width="44" height="44" />
      <UsdcSvg x="78" y="46" width="44" height="44" />
      <TusdSvg x="230" y="46" width="44" height="44" />
      <DaiSvg x="1" y="46" width="44" height="44" />
      <MusdSvg x="118" y="138" width="44" height="44" />
    </Container>
  );
};
