import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Tooltip } from './ReactTooltip';

interface Props {
  className?: string;
  title?: string;
  tooltip?: string;
  border?: boolean;
  padding?: boolean;
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
  align-items: flex-start;
  gap: 1rem;
  height: 3rem;
`;

const Container = styled.div<{ border?: boolean; padding?: boolean }>`
  ${({ border, padding }) => ({
    padding: border ? '1.25rem' : padding ? '0 1.25rem' : '0',
    border: border ? '1px #eee solid' : 0,
    borderRadius: border ? '0.75rem' : 'none',
  })}
`;

const ContainerButton = styled(UnstyledButton)<{
  border?: boolean;
  padding?: boolean;
}>`
  width: 100%;

  :hover {
    background: ${({ theme }) => theme.color.lighterGrey};
    cursor: pointer;
  }

  :active {
    background: ${({ theme }) => theme.color.lightGrey};
  }

  ${({ border, padding }) => ({
    padding: border ? '1.25rem' : padding ? '0 1.25rem' : '0',
    border: border ? '1px #eee solid' : 0,
    borderRadius: border ? '0.75rem' : 'none',
  })}
`;

const DefaultWidget: FC<Props> = ({
  children,
  headerContent,
  title,
  tooltip,
  boldTitle,
}) => {
  const showHeader = !!title || !!tooltip;
  return (
    <>
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
    </>
  );
};

export const Widget: FC<Props> = ({
  border,
  padding,
  children,
  className,
  headerContent,
  title,
  tooltip,
  boldTitle,
}) => {
  return (
    <Container border={border} padding={padding} className={className}>
      <DefaultWidget
        title={title}
        tooltip={tooltip}
        headerContent={headerContent}
        boldTitle={boldTitle}
      >
        {children}
      </DefaultWidget>
    </Container>
  );
};

export const WidgetButton: FC<Props> = ({
  border,
  padding,
  children,
  className,
  headerContent,
  title,
  tooltip,
  boldTitle,
}) => {
  return (
    <ContainerButton border={border} padding={padding} className={className}>
      <DefaultWidget
        title={title}
        tooltip={tooltip}
        headerContent={headerContent}
        boldTitle={boldTitle}
      >
        {children}
      </DefaultWidget>
    </ContainerButton>
  );
};
