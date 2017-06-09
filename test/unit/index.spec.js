require('assert');

const bridgit = require('../../src');

describe('index', () => {
    it('exposes a function', () => {
        expect(typeof bridgit).toBe('function');
    });
});