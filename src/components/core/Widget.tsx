import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Tooltip } from './ReactTooltip';

interface Props {
  className?: string;
  title: string;
  tooltip?: string;
  border?: boolean;
  headerContent?: ReactNode;
}

const Title = styled.h3`
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.black};
`;

const Body = styled.div`
  display: flex;
  gap: 2rem;

  > * {
    width: 100%;
  }
`;

const HeaderContent = styled.div`
  font-size: 0.9rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  height: 2rem;
  overflow: hidden;
`;

const Container = styled.div<Pick<Props, 'border'>>`
  padding: ${({ border }) => (border ? '1rem' : '0')};
  border: ${({ border }) => (border ? '1px #eee solid' : 0)};
`;

export const Widget: FC<Props> = ({
  border,
  children,
  className,
  headerContent,
  title,
  tooltip,
}) => {
  return (
    <Container border={border} className={className}>
      <Header>
        {tooltip ? (
          <Tooltip tip={tooltip}>
            <Title>{title}</Title>
          </Tooltip>
        ) : (
          <Title>{title}</Title>
        )}
        {headerContent && <HeaderContent>{headerContent}</HeaderContent>}
      </Header>
      <Body>{children}</Body>
    </Container>
  );
};
