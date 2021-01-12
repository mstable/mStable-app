import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../theme';
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;

  > button {
    align-self: flex-end;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;
    justify-content: space-between;

    > button {
      width: inherit;
    }
  }
`;

const Container = styled.div<{ border?: boolean; padding?: boolean }>`
  ${({ border, padding }) => ({
    padding: border || padding ? '1.25rem' : '0',
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
    padding: border || padding ? '1.25rem' : '0',
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
          {headerContent && headerContent}
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
