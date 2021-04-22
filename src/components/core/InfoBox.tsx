import styled from 'styled-components'

export const InfoBox = styled.div`
  border: 1px rgba(255, 179, 52, 0.2) solid;
  background: ${({ theme }) => (theme.isLight ? 'rgba(255, 253, 245, 0.3)' : 'none')};
  border-radius: 1rem;
  padding: 1rem;
  color: ${({ theme }) => theme.color.offYellow};

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  h4 {
    font-weight: 600;
    font-size: 1rem;
  }

  p {
    font-size: 0.875rem;
    line-height: 1.375rem;

    span {
      font-weight: 600;
    }

    > button {
      color: ${({ theme }) => theme.color.primary};
      font-weight: 600;
      font-size: 0.875rem;
    }
  }
`
