import React, { FC, MouseEvent } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

interface Props {
  className?: string
  headerTitles?: string[]
  onHeaderClick?: (i: number) => void
}

const Cell = styled.td`
  padding: 1rem;

  > div *:first-child {
    font-weight: 600;
  }

  h3 {
    margin-bottom: 0.25rem;
  }
  span {
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const Row = styled.tr<{ isSelectable: boolean }>`
  cursor: ${({ isSelectable }) => isSelectable && 'pointer'};

  :hover {
    background: ${({ theme }) => theme.color.onboardItemHover};

    > td:nth-last-child(2) {
      display: ${({ isSelectable }) => isSelectable && 'none'};
    }

    > td:last-child {
      display: ${({ isSelectable }) => isSelectable && 'flex'};
    }
  }
`

const Content = styled.table`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;

  td {
    display: flex;
    align-items: center;
    min-height: 4rem;
  }

  td:not(:first-child) {
    justify-content: flex-end;
  }

  > * {
    display: flex;
    justify-content: space-between;

    > td {
      flex: 1;
    }

    > td:not(:first-child) {
      text-align: right;
    }

    > td:last-child {
      display: none;
    }
  }

  > tr:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.defaultBorder};
  }
`

const Header = styled.thead<{ isSelectable: boolean }>`
  display: flex;
  padding: 0.5rem 0;

  > tr {
    display: flex;
    flex: 1;
    justify-content: space-between;
    cursor: ${({ isSelectable }) => isSelectable && 'pointer'};
  }

  > tr > * {
    flex: 1;
    text-align: right;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    padding: 0 1rem;
  }

  > tr > *:first-child {
    text-align: left;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TableCell: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <Cell role="cell" className={className}>
      <div>{children}</div>
    </Cell>
  )
}

export const TableRow: FC<{ onClick?: () => void; buttonTitle?: string }> = ({ children, buttonTitle, onClick }) => {
  const handleOnClick = (e: MouseEvent<HTMLButtonElement | HTMLTableRowElement>): void => {
    e?.stopPropagation()
    e?.preventDefault()
    onClick?.()
  }
  return (
    <Row role="row" onClick={handleOnClick} isSelectable={!!onClick}>
      {children}
      <Cell role="cell">
        {buttonTitle && (
          <Button highlighted onClick={handleOnClick}>
            {buttonTitle}
          </Button>
        )}
      </Cell>
    </Row>
  )
}

export const Table: FC<Props> = ({ children, className, headerTitles, onHeaderClick }) => {
  return (
    <Container role="table" className={className}>
      {!!headerTitles?.length && (
        <Header isSelectable={!!onHeaderClick}>
          <tr>
            {headerTitles?.map((title, i) => (
              <th role="columnheader" key={title} title="Sort by" onClick={() => onHeaderClick?.(i)}>
                <span>{title}</span>
              </th>
            ))}
          </tr>
        </Header>
      )}
      <Content>{children}</Content>
    </Container>
  )
}
