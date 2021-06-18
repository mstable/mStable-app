import React, { FC, MouseEvent } from 'react'
import styled from 'styled-components'
import { Button } from './Button'
import { Tooltip } from './ReactTooltip'

interface Props {
  className?: string
  headerTitles?: {
    title: string
    tooltip?: string
  }[]
  tooltips?: (string | undefined)[]
  onHeaderClick?: (i: number) => void
  widths?: number[]
}

const Cell = styled.td<{ width?: number }>`
  padding: 0 1rem;
  display: flex;

  flex-basis: ${({ width }) => width && `${width}%`};

  h3 {
    margin-bottom: 0.25rem;
  }
  span {
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const HeaderCell = styled.th<{ width?: number }>`
  padding: 0 1rem;
  display: flex;
  flex-basis: ${({ width }) => width && `${width}%`};
`

const Row = styled.tr<{ isSelectable: boolean }>`
  cursor: ${({ isSelectable }) => isSelectable && 'pointer'};

  :hover {
    background: ${({ theme, isSelectable }) => isSelectable && theme.color.onboardItemHover};

    > td:nth-last-child(2) {
      display: ${({ isSelectable }) => isSelectable && 'none'};
    }

    > td:last-child {
      display: ${({ isSelectable }) => isSelectable && 'flex'};
    }
  }
`

const Content = styled.tbody<{ hiddenCellWidth?: number }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  overflow: hidden;

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

  // Hidden by default; take last cell width
  > tr td:last-child {
    flex-basis: ${({ hiddenCellWidth }) => `${hiddenCellWidth}%`};
  }
`

const Header = styled.thead<{ isSelectable: boolean }>`
  display: flex;
  padding: 0.5rem 0;

  th:not(:first-child) {
    justify-content: flex-end;
  }

  > tr {
    display: flex;
    flex: 1;
    justify-content: space-between;
    cursor: ${({ isSelectable }) => isSelectable && 'pointer'};
  }

  > tr > * {
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

const Container = styled.table`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TableCell: FC<{ className?: string; width?: number }> = ({ children, className, width }) => {
  return (
    <Cell role="cell" className={className} width={width}>
      <div>{children}</div>
    </Cell>
  )
}

export const TableRow: FC<{ className?: string; onClick?: () => void; buttonTitle?: string }> = ({
  children,
  buttonTitle,
  onClick,
  className,
}) => {
  const handleOnClick = (e: MouseEvent<HTMLButtonElement | HTMLTableRowElement>): void => {
    e?.stopPropagation()
    e?.preventDefault()
    onClick?.()
  }
  return (
    <Row className={className} role="row" onClick={handleOnClick} isSelectable={!!onClick}>
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

export const Table: FC<Props> = ({ children, className, headerTitles, onHeaderClick, widths }) => {
  return (
    <Container role="table" className={className}>
      {!!headerTitles?.length && (
        <Header isSelectable={!!onHeaderClick}>
          <tr>
            {headerTitles.map(({ title, tooltip }, i) => (
              <HeaderCell role="columnheader" key={title} onClick={() => onHeaderClick?.(i)} width={widths?.[i]}>
                <span>{title}</span>
                {tooltip && <Tooltip tip={tooltip} />}
              </HeaderCell>
            ))}
          </tr>
        </Header>
      )}
      <Content hiddenCellWidth={widths?.[widths.length - 1]}>{children}</Content>
    </Container>
  )
}
