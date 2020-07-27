import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { Color, ViewportWidth } from '../../theme';

interface Props {
  bottomControls?: boolean;
  sideControls?: boolean;
  className?: string;
  initialItem?: string;
  skipButton?: JSX.Element;
  items: {
    key: string;
    children: JSX.Element;
  }[];
}

const SliderItem = styled.section`
  user-select: none;
  height: calc(100% - 32px);
  overflow-y: auto;
  width: 100%;
  flex: 0 0 auto;
  flex-wrap: nowrap;
`;

const SliderItems = styled.div<{ activeIdx: number }>`
  transition: transform 0.4s ease;
  transform: translateX(${({ activeIdx }) => -1 * (activeIdx * 100)}%);
  display: flex;
  height: 100%;
`;

const SliderContainer = styled.div`
  overflow-x: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const StepIcons = styled.div`
  display: flex;
  padding: 0 32px;
`;

const StepIcon = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  margin: 12px 6px;
  cursor: pointer;
  background: white;

  border-radius: 100%;
  opacity: ${({ active }) => (active ? '1' : '0.4')};
  transition: opacity 0.3s ease;
`;

const BottomControls = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const DirectionalArrow = styled.div<{ disabled: boolean }>`
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0 : 0.5)};
`;

const LeftArrow = styled(DirectionalArrow)`
  left: 24px;
  border-right: 12px solid ${Color.white};
`;

const RightArrow = styled(DirectionalArrow)`
  right: 24px;
  border-left: 12px solid ${Color.white};
`;

const SideControls = styled.div`
  display: none;
  @media (min-width: ${ViewportWidth.s}) {
    position: absolute;
    bottom: 50%;
    width: 100%;
    display: block;
  }
`;

const SkipButtonContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const Slider: FC<Props> = ({
  className,
  items,
  bottomControls,
  initialItem,
  sideControls,
  skipButton,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(
    initialItem ? items.findIndex(item => item.key === initialItem) : 0,
  );

  const next = useCallback(() => {
    if (activeIdx < items.length - 1) {
      setActiveIdx(activeIdx + 1);
    }
  }, [setActiveIdx, activeIdx, items.length]);

  const previous = useCallback(() => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  }, [setActiveIdx, activeIdx]);

  const swipeableHandlers = useSwipeable({
    trackTouch: true,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    onSwipedLeft: ({ event }) => {
      event.stopPropagation();
      next();
    },
    onSwipedRight: ({ event }) => {
      event.stopPropagation();
      previous();
    },
  });

  return (
    <Container
      className={className}
      ref={swipeableHandlers.ref}
      onMouseDown={swipeableHandlers.onMouseDown}
    >
      <SliderContainer>
        <SliderItems activeIdx={activeIdx}>
          {items.map(({ children, key }) => (
            <SliderItem key={key}>{children}</SliderItem>
          ))}
        </SliderItems>
      </SliderContainer>
      {bottomControls ? (
        <BottomControls>
          <StepIcons>
            {items.map(({ key }, index) => (
              <StepIcon
                key={key}
                active={activeIdx === index}
                onClick={() => {
                  setActiveIdx(index);
                }}
              />
            ))}
          </StepIcons>
        </BottomControls>
      ) : null}
      {sideControls ? (
        <SideControls>
          <LeftArrow onClick={previous} disabled={activeIdx === 0} />
          <RightArrow
            onClick={next}
            disabled={activeIdx === items.length - 1}
          />
        </SideControls>
      ) : null}
      {skipButton ? (
        <SkipButtonContainer>{skipButton}</SkipButtonContainer>
      ) : null}
    </Container>
  );
};
