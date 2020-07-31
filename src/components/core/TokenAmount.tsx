import React, { FC } from 'react';
import styled from 'styled-components';

import { Amount, Props as AmountProps } from './Amount';
import { TokenIcon } from '../icons/TokenIcon';
import { mapSizeToFontSize, mapSizeToIconSize, Size } from '../../theme';
import { ExternalLink } from './ExternalLink';
import { BigDecimal } from '../../web3/BigDecimal';
import { getEtherscanLink, truncateAddress } from '../../web3/strings';

interface Props extends AmountProps {
  address?: string;
  href?: string;
  symbol: string;
  className?: string;
  size?: Size;
  price?: BigDecimal;
}

const Symbol = styled.div`
  font-weight: bold;
`;

const Container = styled.div<{ size: Size }>`
  display: flex;
  align-items: flex-start;
  margin: 4px 0;

  font-size: ${({ size }) => mapSizeToFontSize(size)};

  > :first-child {
    height: ${mapSizeToIconSize};
    width: ${mapSizeToIconSize};
    margin-right: 8px;
  }
`;

export const TokenAmount: FC<Props> = ({
  address,
  amount,
  className,
  children,
  commas,
  countup,
  decimalPlaces,
  format,
  href,
  price,
  size = Size.m,
  suffix,
  symbol,
}) => (
  <Container className={className} size={size}>
    <TokenIcon symbol={symbol} />
    <div>
      <Symbol>
        {href ? <ExternalLink href={href}>{symbol}</ExternalLink> : symbol}{' '}
        {children}
      </Symbol>
      {!amount && address ? (
        <ExternalLink href={getEtherscanLink(address, 'token')}>
          {truncateAddress(address)}
        </ExternalLink>
      ) : (
        <Amount
          amount={amount}
          commas={commas}
          countup={countup}
          decimalPlaces={decimalPlaces}
          format={format}
          price={price}
          suffix={suffix}
        />
      )}
    </div>
  </Container>
);
