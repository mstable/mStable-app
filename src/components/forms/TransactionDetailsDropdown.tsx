import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => `${theme.spacing.m} 0`};
`;

const Label = styled.div`
  cursor: pointer;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const Details = styled.div<{ active: boolean }>`
  margin: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s};
  border-top: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  border-bottom: 1px ${({ theme }) => theme.color.blackTransparent} solid;
  display: ${({ active }) => (active ? 'block' : 'none')};
  
  > :last-child {
    padding-bottom: 0;  
  }
`;

export const TransactionDetailsDropdown: FC<{}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);
  return (
    <Container>
      <Label onClick={toggleOpen}>
        <span>{open ? 'Hide details' : 'See details'}</span>
      </Label>
      <Details active={open}>{children}</Details>
    </Container>
  );
};
