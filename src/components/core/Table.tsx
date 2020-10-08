import React, { FC, ReactNode, ReactElement, useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { AccentColors } from '../../types';
import { Color, ViewportWidth } from '../../theme';
import { Tooltip } from './ReactTooltip';

export interface TableRow<TColumns extends number> {
  url?: string;
  id: string;
  colors?: AccentColors;
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
  noItems?: string;
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

const DivRow = styled.div<{ link?: boolean; colors?: AccentColors }>`
  background: ${Color.white};
  width: 100%;
  cursor: ${({ link }) => (link ? 'pointer' : 'auto')};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ link, colors }) =>
      link ? colors?.light ?? Color.blackTransparent : 'transparent'};
  }

  > ${Column} {
    border-top: 1px solid
      ${({ colors }) => colors?.light ?? Color.blackTransparent};
    border-bottom: 1px solid
      ${({ colors }) => colors?.light ?? Color.blackTransparent};
    :first-child {
      border-left: 1px solid
        ${({ colors }) => colors?.light ?? Color.blackTransparent};
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      padding-left: 4px;
    }
    :last-child {
      border-right: 1px solid
        ${({ colors }) => colors?.light ?? Color.blackTransparent};
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      padding-right: 4px;
    }
  }
`;

const HeaderRow = styled.div`
  background: transparent;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;

  > ${Column} {
    border: none !important;
  }
`;

const NoItems = styled.div`
  height: 32px;
`;

const Row: FC<{ href?: string; colors?: AccentColors }> = ({
  href,
  children,
  colors,
}) => {
  const history = useHistory();
  const handleClick = useCallback(
    event => {
      if (href) {
        event.stopPropagation();
        history.push(href);
      }
    },
    [history, href],
  );

  return (
    <DivRow colors={colors} link={!!href} onClick={handleClick}>
      {children}
    </DivRow>
  );
};

const Container = styled.div`
  display: table;
  border-spacing: 0 4px;
  width: 100%;
  background: transparent;

  > * {
    display: table-row;
    width: 100%;
  }
`;

export const Table = <TColumns extends number>({
  columns,
  items,
  noItems = 'No items.',
}: TableProps<TColumns>): ReactElement => (
  <Container>
    {items.length === 0 ? (
      <NoItems>{noItems}</NoItems>
    ) : (
      <>
        <HeaderRow>
          {columns.map(({ key, title, tip, numeric }) => (
            <Column key={key} numeric={numeric}>
              {tip ? <Tooltip tip={tip}>{title}</Tooltip> : title}
            </Column>
          ))}
        </HeaderRow>
        {items.map(({ id, data, url, colors }) => (
          <Row key={id} href={url} colors={colors}>
            {columns.map(({ key, numeric }) => (
              <Column key={key} numeric={numeric}>
                <Data>{data[key] ?? '-'}</Data>
              </Column>
            ))}
          </Row>
        ))}
      </>
    )}
  </Container>
);
