import React, { FC, ReactNode, ReactElement } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { AccentColors } from '../../types'
import { Color } from '../../theme'
import { Tooltip } from './ReactTooltip'

export interface TableRow<TColumns extends number> {
  url?: string
  id: string
  colors?: AccentColors
  data: Partial<Record<TColumns, string | number | ReactNode>>
}

export interface TableColumn<TColumns extends number> {
  key: TColumns
  title: string
  tip?: string
  numeric?: boolean
}

export interface TableProps<TColumns extends number> {
  className?: string
  columns: TableColumn<TColumns>[]
  items: TableRow<TColumns>[]
  noItems?: string
}

const Data = styled.div`
  font-size: 0.9rem;
  line-height: 1.3rem;
`

const Column = styled.div<{ numeric?: boolean }>`
  text-align: ${({ numeric }) => (numeric ? 'right' : 'left')};
  padding: 1rem;

  > span {
    justify-content: ${({ numeric }) => (numeric ? 'flex-end' : 'initial')};
  }

  ${Data} {
    ${({ numeric, theme }) => (numeric ? theme.mixins.numeric : '')}
  }
`

const DivRow = styled.div<{ link?: boolean; colors?: AccentColors }>`
  border: 1px solid ${({ colors }) => colors?.light ?? Color.blackTransparent};
  border-radius: 1rem;
  cursor: ${({ link }) => (link ? 'pointer' : 'auto')};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ link, theme }) => (link ? theme.color.bodyTransparenter : 'transparent')};
  }
`

const HeaderRow = styled.div`
  font-size: 1rem;
  font-weight: 600;
`

const Row: FC<{ href?: string; colors?: AccentColors }> = ({ href, children, colors }) => {
  const history = useHistory()

  return (
    <DivRow
      colors={colors}
      link={!!href}
      onClick={event => {
        if (href) {
          event.stopPropagation()
          history.push(href)
        }
      }}
    >
      {children}
    </DivRow>
  )
}

const Container = styled.div<{ columns: number }>`
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: auto;

  > * {
    display: grid;
    grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 1rem;
  }
`

export const Table = <TColumns extends number>({ className, columns, items }: TableProps<TColumns>): ReactElement => (
  <Container columns={columns.length} className={className}>
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
  </Container>
)
