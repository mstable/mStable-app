import { Connector } from '../types';

export const CONNECTORS: Connector[] = [
  {
    id: 'injected',
    subType: 'metamask',
    label: 'MetaMask',
  },
  {
    id: 'injected',
    subType: 'brave',
    label: 'Brave',
  },
  {
    id: 'injected',
    subType: 'meetOne',
    label: 'MEET.ONE',
  },
  { id: 'fortmatic', label: 'Fortmatic' },
  { id: 'portis', label: 'Portis' },
  { id: 'authereum', label: 'Authereum' },
  { id: 'squarelink', label: 'Squarelink' },
  { id: 'torus', label: 'Torus' },
  { id: 'walletconnect', label: 'WalletConnect' },
  { id: 'walletlink', label: 'WalletLink' },
  { id: 'frame', label: 'Frame' },
];
