// eslint-disable-next-line spaced-comment
/// <reference types="node" />

// eslint-disable-next-line max-classes-per-file
declare module '@metamask/onboarding' {
  // eslint-disable-next-line import/no-default-export
  export default class MetamaskOnboarding {
    isMetaMaskInstalled(): boolean;

    state: string;

    startOnboarding(): void;

    stopOnboarding(): void;
  }
}