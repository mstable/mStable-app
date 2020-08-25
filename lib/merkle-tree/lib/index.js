"use strict";
// Shamelessly adapted from OpenZeppelin-contracts test utils
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTree = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const web3_utils_1 = require("web3-utils");
// Merkle tree called with 32 byte hex values
class MerkleTree {
    constructor(elements) {
        this.elements = elements
            .filter(el => el)
            .map(el => Buffer.from(web3_utils_1.hexToBytes(el)));
        // Sort elements
        this.elements.sort(Buffer.compare);
        // Deduplicate elements
        this.elements = this.bufDedup();
        // Create layers
        this.layers = this.getLayers();
    }
    static bufArrToHexArr(arr) {
        if (arr.some(el => !Buffer.isBuffer(el))) {
            throw new Error('Array is not an array of buffers');
        }
        return arr.map(el => '0x' + el.toString('hex'));
    }
    static sortAndConcat(...args) {
        return Buffer.concat([...args].sort(Buffer.compare));
    }
    static getPairElement(idx, layer) {
        const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
        if (pairIdx < layer.length) {
            return layer[pairIdx];
        }
        else {
            return null;
        }
    }
    static bufIndexOf(el, arr) {
        let hash;
        // Convert element to 32 byte hash if it is not one already
        if (el.length !== 32 || !Buffer.isBuffer(el)) {
            hash = ethereumjs_util_1.keccakFromString(el);
        }
        else {
            hash = el;
        }
        for (let i = 0; i < arr.length; i++) {
            if (hash.equals(arr[i])) {
                return i;
            }
        }
        return -1;
    }
    static getNextLayer(elements) {
        return elements.reduce((layer, el, idx, arr) => {
            if (idx % 2 === 0) {
                // Hash the current element with its pair element
                layer.push(MerkleTree.combinedHash(el, arr[idx + 1]));
            }
            return layer;
        }, []);
    }
    static combinedHash(first, second) {
        if (!first) {
            return second;
        }
        if (!second) {
            return first;
        }
        return ethereumjs_util_1.keccak256(MerkleTree.sortAndConcat(first, second));
    }
    getLayers() {
        if (this.elements.length === 0) {
            return [['']];
        }
        const layers = [];
        layers.push(this.elements);
        // Get next layer until we reach the root
        while (layers[layers.length - 1].length > 1) {
            layers.push(MerkleTree.getNextLayer(layers[layers.length - 1]));
        }
        return layers;
    }
    bufDedup() {
        return this.elements.filter((el, idx) => {
            return idx === 0 || !this.elements[idx - 1].equals(el);
        });
    }
    get root() {
        return this.layers[this.layers.length - 1][0];
    }
    get hexRoot() {
        return ethereumjs_util_1.bufferToHex(this.root);
    }
    getProof(el) {
        let idx = MerkleTree.bufIndexOf(el, this.elements);
        if (idx === -1) {
            throw new Error('Element does not exist in Merkle tree');
        }
        return this.layers.reduce((proof, layer) => {
            const pairElement = MerkleTree.getPairElement(idx, layer);
            if (pairElement) {
                proof.push(pairElement);
            }
            idx = Math.floor(idx / 2);
            return proof;
        }, []);
    }
    // external call - convert to buffer
    getHexProof(_el) {
        const el = Buffer.from(web3_utils_1.hexToBytes(_el));
        const proof = this.getProof(el);
        return MerkleTree.bufArrToHexArr(proof);
    }
}
exports.MerkleTree = MerkleTree;
//# sourceMappingURL=index.js.map