require('assert');

const hawkAction = require('../../../src/commands/hawk');

describe('hawk command', () => {
    it('throws when option is not an object', () => {
        expect(() => {
            hawkAction('foo');
        }).toThrow();
    });
});