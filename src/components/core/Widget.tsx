import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Tooltip } from './ReactTooltip';

interface Props {
  className?: string;
  title?: string;
  tooltip?: string;
  border?: boolean;
  headerContent?: ReactNode;
  boldTitle?: boolean;
}

const Title = styled.h3<{ bold?: boolean }>`
  font-weight: ${({ bold }) => bold && 600};
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
  margin-bottom: 0.5rem;
  gap: 1rem;
  height: 2rem;
  overflow: hidden;
`;

const Container = styled.div<Pick<Props, 'border'>>`
  ${({ border }) => ({
    padding: border ? '1.25rem' : '0',
    border: border ? '1px #eee solid' : 0,
    borderRadius: border ? '0.75rem' : 'none',
  })}
`;

export const Widget: FC<Props> = ({
  border,
  children,
  className,
  headerContent,
  title,
  tooltip,
  boldTitle,
}) => {
  const showHeader = !!title || !!tooltip;
  return (
    <Container border={border} className={className}>
      {showHeader && (
        <Header>
          {tooltip ? (
            <Tooltip tip={tooltip}>
              <Title>{title}</Title>
            </Tooltip>
          ) : (
            <Title bold={boldTitle}>{title}</Title>
          )}
          {headerContent && <HeaderContent>{headerContent}</HeaderContent>}
        </Header>
      )}
      <Body>{children}</Body>
    </Container>
  );
};
