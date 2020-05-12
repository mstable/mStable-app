import styled from 'styled-components';

export const BassetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 8px 8px;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.s};

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;