require('assert');

const path = require('path');
const fs = require('fs');
const {requireSrc, resolveSrc, sleep} = require('../../helpers');

const configAction = requireSrc('commands/config');
const logger = requireSrc('utils/logger');
const {configFilePath, configKeys} = requireSrc('constants');


describe('config command', () => {
    let error, warn, config, success;
    beforeAll(() => {
        error = jest.spyOn(logger, 'error');
        warn = jest.spyOn(logger, 'warn');
        config = jest.spyOn(logger, 'config');
        success = jest.spyOn(logger, 'success');
    });

    beforeEach(() => {
        try {
            fs.unlinkSync(configFilePath);
        } catch(e) {}
    });

    afterEach(() => {
        error.mockReset();
        warn.mockReset();
        config.mockReset();
        success.mockReset();
    });

    it('should warn when sub-command is not valid', () => {
        configAction('foo');
        expect(error).toHaveBeenCalled();
    });

    it('should print specified key/value with <get>', () => {
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

    it('should save key/value in config file with <set>', () => {
        let foo = 'foo' + Date.now();
        configAction('set', 'id', foo);
        let config = fs.readFileSync(configFilePath, {encoding: 'utf-8'});
        config = JSON.parse(config);
        expect(config.id).toBe(foo);
    });

    it('should generate an sample config file with <new>', async () => {
        configAction('new', 'tmp.new');
        // write file here is async function, so...
        await sleep(200);
        let config = fs.readFileSync(path.resolve('tmp.new.json'), {encoding: 'utf-8'});
        config = JSON.parse(config);
        expect(Object.keys(config)).toEqual(configKeys);
        expect(success).toHaveBeenCalled();
    });

    it('should warn when using <get> with config file can not be loaded', () => {
        configAction('get', 'id', null);
        expect(error).toHaveBeenCalled();
    });

    it('should create new config file with <set> when it can not be found', () => {
        configAction('set', 'id', 'foo');
        let config = fs.readFileSync(configFilePath, {encoding: 'utf-8'});
        expect(config).toEqual(JSON.stringify({id: 'foo'}))
    });
});
