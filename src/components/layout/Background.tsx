import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  home: boolean;
}

const Container = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: -1;
  transition: background-color 0.3s ease;
  background-color: ${({ theme, home }) =>
    home ? theme.color.gold : theme.color.offWhite};
`;

export const Background: FC<Props> = ({ home }) => <Container home={home} />;
