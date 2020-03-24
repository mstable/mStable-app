import React, { FC } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoSVG } from './logo.svg';

interface Props {
  active?: boolean;
}

const Dots = styled.svg<Props>`
  width: 100%;
  height: 100%;

  opacity: ${props => (props.active ? '1' : '0.1')};

  #blue {
    fill: ${props => props.theme.color.blue};
  }
  #gold {
    fill: ${props => props.theme.color.gold};
  }
  #green {
    fill: ${props => props.theme.color.green};
  }
`;

const SVGContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const DotsContainer = styled(SVGContainer)`
  z-index: -2;
`;

const LogoContainer = styled(SVGContainer)<Props>`
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: ${props => (props.active ? '1' : '0.1')};

  svg {
    width: 15%;
  }
`;

// TODO: Animate this
export const Background: FC<Props> = ({ active }) => (
  <>
    <DotsContainer>
      <Dots active={active}>
        <circle id="blue" r="5%" cx="20%" cy="25%" />
        <circle id="gold" r="20%" cx="80%" cy="65%" />
        <circle id="green" r="5%" cx="30%" cy="80%" />
      </Dots>
    </DotsContainer>
    <LogoContainer active={active}>
      <LogoSVG />
    </LogoContainer>
  </>
);
