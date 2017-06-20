require('assert');
const {requireSrc} = require('../../helpers');

const {clearEmpty} = requireSrc('utils');

describe('util index, clearEmpty', () => {
    it('throws when argument is not object', () => {
        expect(() => {
            clearEmpty('foo');
        }).toThrow();
    });

    it('returns a new object', () => {
        let src = {};
        let ret = clearEmpty(src);
        expect(ret).not.toBe(src);
    });

    it('remove properties whose value is null or undefined', () => {
        let src = {
            name: 'foo',
            age: null,
            sex: undefined
        };
        let ret = clearEmpty(src);
        expect(ret).toEqual({name: 'foo'});
    });
});