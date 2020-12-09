import React, { FC } from 'react';
import styled from 'styled-components';

import { H2, P } from '../core/Typography';
import { FontSize } from '../../theme';
import { ReactComponent as MUSDBadge } from '../icons/tokens/mUSD.svg';

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
  display: flex;

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
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 1rem;

  h2 {
    font-size: ${FontSize.xl};
    font-weight: 600;
  }

  p {
    padding: 0;
    font-size: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`;

export const PageHeader: FC<Props> = ({ children, title, subtitle }) => {
  const asset = Masset.MUSD; // query from url
  const icon = MassetIcons[asset];

  return (
    <Container>
      <Row>
        <Icon>{icon}</Icon>
        <Column>
          <H2>{title}</H2>
          <P>{subtitle}</P>
        </Column>
      </Row>
      {children && <ChildrenRow>{children}</ChildrenRow>}
    </Container>
  );
};
