import React, { FC } from 'react';
import styled from 'styled-components';
import { UnstyledButton } from '../core/Button';

interface Props {
  onClick(): void;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  enabledColor?: string;
  disabledColor?: string;
}

const Circle = styled.span`
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  transition: 0.2s;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
`;

const Container = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0;
`;

const Toggle = styled.span<{
  checked?: boolean;
  disabled?: boolean;
  enabledColor?: string;
  disabledColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40px;
  height: 20px;
  background: ${({
    checked,
    theme,
    enabledColor = theme.color.green,
    disabledColor = theme.color.blackTransparent,
  }) => (checked ? enabledColor : disabledColor)};
  border-radius: 40px;
  position: relative;
  transition: background-color 0.2s;

  &:active ${Circle} {
    ${({ disabled }) => (disabled ? '' : 'width: 50%')};
  }

  ${Circle} {
    ${({ checked }) =>
      checked ? `left: calc(100% - 2px); transform: translateX(-100%);` : ''}
  }
`;

export const ToggleInput: FC<Props> = ({
  onClick,
  checked,
  className,
  disabled,
  disabledColor,
  enabledColor,
}) => (
  <Container
    onClick={onClick}
    type="button"
    disabled={disabled}
    className={className}
  >
    <Toggle
      checked={checked}
      disabled={disabled}
      enabledColor={enabledColor}
      disabledColor={disabledColor}
    >
      <Circle />
    </Toggle>
  </Container>
);
