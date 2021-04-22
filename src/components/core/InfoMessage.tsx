import styled from 'styled-components'

export const InfoMessage = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.color.backgroundAccent};
  padding: 1rem;
  border-radius: 0.5rem;

  span {
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`
