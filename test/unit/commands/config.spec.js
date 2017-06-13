require('assert');

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const {requireSrc, resolveSrc, sleep} = require('../../helpers');

const configAction = requireSrc('commands/config');
const logger = requireSrc('utils/logger');
const {configFilePath, configKeys} = requireSrc('constants');


describe('config command', () => {
    let error, warn, config;
    beforeAll(() => {
        error = jest.spyOn(logger, 'error');
        warn = jest.spyOn(logger, 'warn');
        config = jest.spyOn(logger, 'config');
    });

    afterEach(() => {
        error.mockReset();
        warn.mockReset();
        config.mockReset();
    });

    it('should warn when sub-command is not valid', () => {
        configAction('foo');
        expect(error).toHaveBeenCalled();
    });

    it('should print specified key/value with <get> sub-command', () => {
        fs.writeFileSync(
            configFilePath,
            JSON.stringify({id: 'foo', key: 'bar'}),
            {
                encoding: 'utf-8',
            }
        );
        configAction('get', 'id', null);
        expect(config).toHaveBeenCalledWith({id: 'foo'});


        configAction('get', null, null);
        expect(config).toHaveBeenCalledWith({id: 'foo', key: 'bar'});
    });

    it('should save key/value in config file with <set> sub-command', () => {
        let foo = 'foo' + Date.now();
        configAction('set', 'id', foo);
        let config = require(configFilePath);
        expect(config.id).toBe(foo);
    });

    it('should generate an sample config file with <new> sub-command', async () => {
        configAction('new', 'tmp.new');
        // write file here is async function, so...
        await sleep(200);
        let config = require(path.resolve('tmp.new.json'));
        expect(Object.keys(config)).toEqual(configKeys);
    });

    it('should work when config file can not be loaded', () => {
        rimraf.sync(configFilePath);

        expect(() => {
            configAction('get', 'id', null);
            configAction('set', 'id', 'foo');
        }).not.toThrow();
    });
});
