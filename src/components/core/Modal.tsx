import React, {
  FC,
  ReactElement,
  RefObject,
  useLayoutEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { ViewportWidth } from '../../theme';

import { UnstyledButton } from './Button';

interface Props {
  className?: string;
  title: ReactElement | string;
  hideModal?(): void;
  open: boolean;
  onExited(): void;
}

const Title = styled.div`
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px ${({ theme }) => theme.color.accent} solid;
  background: ${({ theme }) => theme.color.background};
`;

const CloseButton = styled(UnstyledButton)`
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;

  :hover {
    background: ${({ theme }) => theme.color.accent};
  }
  :active {
    background: ${({ theme }) => theme.color.accentContrast};
  }
`;

const Body = styled.div``;

const Container = styled.div`
  position: relative;
  overflow-y: scroll;
  min-width: 50vw;
  width: 100%;
  margin: 0 1rem;
  max-height: calc(90vh - 50px);
  background: ${({ theme }) => theme.color.background};
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.backgroundAccent} solid;

  @media (min-width: ${ViewportWidth.m}) {
    margin: 0 2rem;
    max-width: 44rem;
  }
`;

const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: ${({ theme }) =>
    theme.isLight ? `rgba(0, 0, 0, 0.5)` : `rgba(0, 0, 0, 0.9)`};
  
  @supports (backdrop-filter: blur(0.25em)) {
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(0.25em);
  }
}
`;

// TODO Fix animation
// const scaleIn = keyframes`
//   0% {
//     transform: scale(1.2);
//     transform-origin: 50% 50%;
//     filter: blur(20px);
//     opacity: 0;
//   }
//   100% {
//     transform: scale(1);
//     transform-origin: 50% 50%;
//     filter: blur(0);
//     opacity: 1;
//   }
// `;

// const Animation = styled(CSSTransition)`
//   ${({ classNames }) => `&.${classNames}-enter`} {
//     animation: ${css`
//         ${scaleIn}`} 0.5s cubic-bezier(0.19, 1, 0.22, 1) normal;
//   }

//   ${({ classNames }) => `&.${classNames}-exit-active`} {
//     animation: ${css`
//         ${scaleIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
//   }
// `;

export const Modal: FC<Props> = ({
  children,
  title,
  className,
  hideModal,
  open,
}) => {
  const fixedRef = useRef<HTMLDivElement>(null as never);
  const modalRef = useRef<HTMLDivElement>(null as never);

  useOnClickOutside(modalRef as RefObject<HTMLDivElement>, event => {
    if (event.target === fixedRef.current) {
      hideModal?.();
    }
  });

  useLayoutEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        hideModal?.();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [hideModal]);

  if (!open) return null;

  return (
    <FixedContainer ref={fixedRef}>
      <Container className={className} ref={modalRef}>
        <Header>
          <Title>{title}</Title>
          {hideModal && (
            <div>
              <CloseButton onClick={hideModal}>✕</CloseButton>
            </div>
          )}
        </Header>
        <Body>{children}</Body>
      </Container>
    </FixedContainer>
  );
};
