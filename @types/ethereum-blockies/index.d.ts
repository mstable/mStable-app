declare module 'ethereum-blockies' {
  export interface Props {
    seed?: string;
    color?: string;
    bgcolor?: string;
    size?: number;
    scale?: number;
    spotcolor?: string;
  }
  export function create(props: Props): HTMLCanvasElement;
  export function render(props: Props, canvas: HTMLCanvasElement): void;
}
