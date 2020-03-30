import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Label = styled.div`
  cursor: pointer;
  text-align: center;
`;

const Details = styled.div<{ active: boolean }>`
  margin: ${props => props.theme.spacing.m};
  padding: ${props => props.theme.spacing.s};
  border-top: 2px ${props => props.theme.color.foreground} solid;
  border-bottom: 2px ${props => props.theme.color.foreground} solid;
  display: ${props => (props.active ? 'block' : 'none')};
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
