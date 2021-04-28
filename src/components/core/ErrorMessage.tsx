import React, { FC } from 'react'
import styled from 'styled-components'
import reactStringReplace from 'react-string-replace'

const Percentage = styled.span<{ isBonus: boolean }>`
  color: ${({ isBonus }) => (isBonus ? 'green' : 'red')};
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  /* background: ${({ theme }) => theme.color.redTransparenter}; */

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
    max-width: 50ch;
  }
`

// CHANGEME - WarningMessage
export const ErrorMessage: FC<{ error: string | Error }> = ({ error: _error }) => {
  const error = typeof _error === 'string' ? _error : _error.message ?? _error.toString()
  const regex = /([+-][0-9]*.[0-9]*%)/g
  return (
    <Container>
      <p>
        {reactStringReplace(error, regex, (match, i) => (
          <Percentage isBonus={match.includes('+')} key={i}>
            {match}
          </Percentage>
        ))}
      </p>
    </Container>
  )
}
