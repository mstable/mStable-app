import React, { FC } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparenter};

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
    max-width: 50ch;
  }
`

export const ErrorMessage: FC<{ error: string | Error }> = ({ error }) => (
  <Container>
    <p>{typeof error === 'string' ? error : error.message ?? error.toString()}</p>
  </Container>
)
