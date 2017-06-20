require('assert');
const path = require('path');
const fs = require('fs');
const {requireSrc} = require('../../helpers');

const merge = requireSrc('utils/mergeConfiguration');
const {configFilePath, configKeys} = requireSrc('constants');


describe('mergeConfiguration', () => {
    beforeEach(() => {
        try {
            fs.unlinkSync(configFilePath);
        } catch(e) {}
    });

    it('should merge defaults and configurations with arguments', () => {
        fs.writeFileSync(
            configFilePath,
            JSON.stringify({origin: 'https://www.google.com'}),
            {encoding: 'utf-8'}
        );

        let res = merge({id: 'foo'}, {key: 'bar'});
        expect(res).toEqual({
            id: 'foo',
            key: 'bar',
            origin: 'https://www.google.com',
            prefix: '',
            algorithm: 'sha256',
            encryptPayload: true
        });
    });

    it('should throw when argument is not object', () => {
        expect(() => {
            merge('foo');
        }).toThrow();
    });

    it('should omit null in configuration and arguments', () => {
        fs.writeFileSync(
            configFilePath,
            JSON.stringify({origin: null}),
            {encoding: 'utf-8'}
        );

        let res = merge({id: null}, {key: null});
        expect(res).toEqual({
            origin: 'http://127.0.0.1:8000',
            prefix: '',
            algorithm: 'sha256',
            encryptPayload: true
        });
    })
})