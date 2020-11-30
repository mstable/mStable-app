import React, { FC } from 'react';
import styled from 'styled-components';

import { H2, H3 } from '../core/Typography';
import { FontSize } from '../../theme';
import { ReactComponent as MUSDBadge } from '../icons/badges/musd.svg';

enum Masset {
  MUSD = 'MUSD',
}

interface Props {
  title: string;
  subtitle: string;
}

const MassetIcons: { [masset: string]: JSX.Element } = {
  MUSD: <MUSDBadge />,
};

const Icon = styled.div`
  padding: 0;

  img,
  svg {
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }

  img + div {
    display: none;
  }
`;

const Container = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  max-width: 500px;

  h2 {
    font-size: ${FontSize.xl};
    font-weight: 600;
  }
`;

export const PageHeader: FC<Props> = ({ children, title, subtitle }) => {
  const asset = Masset.MUSD; // query from url
  const icon = MassetIcons[asset];

  return (
    <Container>
      <Icon>{icon}</Icon>
      <div>
        <H2>{title}</H2>
        <H3>{subtitle}</H3>
        <div>{children}</div>
      </div>
    </Container>
  );
};
