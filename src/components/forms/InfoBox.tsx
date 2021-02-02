import styled from 'styled-components';

export const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
  flex-direction: row !important;

  > span:last-child {
    ${({ theme }) => theme.mixins.numeric}
  }
`;
