import styled from 'styled-components';

export const Form = styled.form``;

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.xl};

  > * {
    flex: 1;
    margin-right: ${props => props.theme.spacing.l};
    &:last-child {
      margin-right: 0;
    }
  }
`;
