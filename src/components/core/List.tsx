import styled from 'styled-components'

export const ListItem = styled.li<{ inverted?: boolean }>`
  font-size: 1rem;
`

export const List = styled.ul<{ inverted?: boolean }>`
  ${ListItem} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
  }
`
