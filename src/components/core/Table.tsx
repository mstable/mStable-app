import React, { FC, ReactNode, ReactElement, useCallback } from 'react';
import styled from 'styled-components';
import { navigate } from 'hookrouter';

import { Color, ViewportWidth } from '../../theme';
import { Tooltip } from './ReactTooltip';

export interface TableRow<TColumns extends number> {
  url?: string;
  id: string;
  colors?: {};
  data: Partial<Record<TColumns, string | number | ReactNode>>;
}

export interface TableColumn<TColumns extends number> {
  key: TColumns;
  title: string;
  tip?: string;
  numeric?: boolean;
}

export interface TableProps<TColumns extends number> {
  columns: TableColumn<TColumns>[];
  items: TableRow<TColumns>[];
}

const Data = styled.div`
  font-size: 12px;

  @media (min-width: ${ViewportWidth.s}) {
    font-size: 14px;
  }
`;

const Column = styled.div<{ numeric?: boolean }>`
  display: table-cell;
  padding: 8px;
  vertical-align: middle;

  text-align: ${({ numeric }) => (numeric ? 'right' : 'left')};

  > span {
    justify-content: ${({ numeric }) => (numeric ? 'flex-end' : 'initial')};
  }

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }

  ${Data} {
    ${({ numeric, theme }) => (numeric ? theme.mixins.numeric : '')}
  }
`;

const DivRow = styled.div<{ link?: boolean }>`
  border-bottom: 1px ${Color.blackTransparenter} solid;
  width: 100%;
  cursor: ${({ link }) => (link ? 'pointer' : 'auto')};

  &:hover {
    background: ${({ link }) =>
      link ? Color.blackTransparenter : 'transparent'};
  }
`;

const Row: FC<{ href?: string }> = ({ href, children }) => {
  const handleClick = useCallback(
    event => {
      if (href) {
        event.stopPropagation();
        navigate(href);
      }
    },
    [href],
  );

  return (
    <DivRow link={!!href} onClick={handleClick}>
      {children}
    </DivRow>
  );
};

const Header = styled(DivRow)`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
`;

const Container = styled.div`
  display: table;
  border-spacing: 0 1px;
  width: 100%;
  background: ${Color.blackTransparenter};

  > * {
    display: table-row;
    width: 100%;
    background: ${Color.offWhite};
  }
`;

export const Table = <TColumns extends number>({
  columns,
  items,
}: TableProps<TColumns>): ReactElement => (
  <Container>
    <Header>
      {columns.map(({ key, title, tip, numeric }) => (
        <Column key={key} numeric={numeric}>
          {tip ? <Tooltip tip={tip}>{title}</Tooltip> : title}
        </Column>
      ))}
    </Header>
    {items.map(({ id, data, url }) => (
      <Row key={id} href={url}>
        {columns.map(({ key, numeric }) => (
          <Column key={key} numeric={numeric}>
            <Data>{data[key] ?? '-'}</Data>
          </Column>
        ))}
      </Row>
    ))}
  </Container>
);
