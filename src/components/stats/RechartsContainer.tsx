import styled from 'styled-components'

export const RechartsContainer = styled.div`
  width: 100%;
  height: auto;

  .recharts-cartesian-axis-tick-line {
    opacity: 0.2;
  }

  .recharts-text,
  .recharts-tooltip-item-list {
    .recharts-tooltip-item-value,
    .recharts-tooltip-item-unit {
      font-family: 'DM Mono', monospace;
    }
  }
`
