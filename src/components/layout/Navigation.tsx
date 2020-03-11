import React, { FC } from 'react';
import { A } from 'hookrouter';

/**
 * Placeholder component for app navigation.
 */
export const Navigation: FC<{}> = () => (
  <nav>
    <ul>
      {['swap', 'earn', 'save'].map(item => (
        <li key={item}>
          <A href={`/${item}`}>{item}</A>
        </li>
      ))}
    </ul>
  </nav>
);
