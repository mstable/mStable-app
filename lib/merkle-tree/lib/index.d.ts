/// <reference types="node" />
export declare class MerkleTree {
    private readonly elements;
    private readonly layers;
    private static bufArrToHexArr;
    private static sortAndConcat;
    private static getPairElement;
    private static bufIndexOf;
    private static getNextLayer;
    private static combinedHash;
    private getLayers;
    private bufDedup;
    constructor(elements: string[]);
    get root(): Buffer;
    get hexRoot(): string;
    getProof(el: Buffer): Buffer[];
    getHexProof(_el: string): string[];
}
