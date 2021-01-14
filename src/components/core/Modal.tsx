import React, {
  FC,
  ReactElement,
  RefObject,
  useLayoutEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px ${({ theme }) => theme.color.accent} solid;
`;

const Body = styled.div``;

const Container = styled.div`
  min-width: 50vw;
  max-width: 90vw;
  max-height: 90vw;
  background: ${({ theme }) => theme.color.background};
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.backgroundAccent} solid;
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

// TODO fix animation
// const scaleIn = keyframes`
//   0% {
//     transform: scale(2);
//     transform-origin: 50% 50%;
//     filter: blur(40px);
//     opacity: 0;
//   }
//   100% {
//     transform: scale(1);
//     transform-origin: 50% 50%;
//     filter: blur(0);
//     opacity: 1;
//   }
// `;
//
// const Animation = styled(CSSTransition)`
//   ${({ classNames }) => `&.${classNames}-enter`} {
//     animation: ${css`
//         ${scaleIn}`} 0.5s cubic-bezier(0.19, 1, 0.22, 1) normal;
//   }
//
//   ${({ classNames }) => `&.${classNames}-exit-active`} {
//     animation: ${css`
//         ${scaleIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
//   }
// `;

export const Modal: FC<Props> = ({ children, title, className, hideModal }) => {
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

  return (
    <FixedContainer ref={fixedRef}>
      <Container className={className} ref={modalRef}>
        <Header>
          <Title>{title}</Title>
          {hideModal && <UnstyledButton onClick={hideModal}>✕</UnstyledButton>}
        </Header>
        <Body>{children}</Body>
      </Container>
    </FixedContainer>
  );
};
