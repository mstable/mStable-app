import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { commify } from 'ethers/utils';

import { P } from '../../core/Typography';
import { Size } from '../../../theme';

const Input = styled.input`
  width: 100%;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const JustifiedRow = styled(P)`
  display: flex;
  justify-content: space-between;
`;

type Props = {
  title: string;
  min: number;
  max: number;
  step: number;
  label: [string, string];
  value: number;
  onChange: (value: number) => void;
};

const pluralize = (label: [string, string], amount: number): string =>
  amount === 1 ? `${label[0]}` : label[1];

const buildLabel = (label: [string, string], amount: number): string =>
  `${commify(amount)} ${pluralize(label, amount)}`;

export const Slider: FC<Props> = ({
  title,
  min,
  max,
  step,
  label,
  value,
  onChange,
}) => {
  const handleChange = useCallback(
    e => onChange(parseInt(e.target.value, 10)),
    [onChange],
  );

  return (
    <div>
      <JustifiedRow size={Size.l}>
        <span>{title}</span>
        <Bold>{buildLabel(label, value)}</Bold>
      </JustifiedRow>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <JustifiedRow size={Size.m}>
        <span>{buildLabel(label, min)}</span>
        <span>{buildLabel(label, max)}</span>
      </JustifiedRow>
    </div>
  );
};
