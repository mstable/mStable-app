import React, { FC } from 'react';
import styled from 'styled-components';

import { Protip } from '../../../core/Protip';

const Gif = styled.a`
  display: flex;
  justify-content: center;
  border-bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 8px 0;

  img {
    overflow: hidden;
    padding: 8px;
    max-width: 100%;
  }
`;

const Container = styled(Protip)`
  margin-bottom: 32px;
`;

export const CurveProtip: FC<{
  alt: string;
  children: JSX.Element;
  href: string;
  imgSrc: string;
  title: string;
}> = ({ title, alt, href, imgSrc, children }) => {
  return (
    <Container title={title}>
      <Gif href={href} target="_blank" rel="noopener noreferrer">
        <img src={imgSrc} alt={alt} />
      </Gif>
      {children}
    </Container>
  );
};
