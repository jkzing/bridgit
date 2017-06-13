require('assert');

const path = require('path');
const os = require('os');
const fs = require('fs');
const {requireSrc} = require('../../helpers');

const hawkAction = requireSrc('commands/hawk');
const configPath = path.join(os.homedir(), '.bridgit.json');

let options, middleware;
jest.mock('../../../src/utils/startServer', () => {
    return jest.fn((m, o) => {
        middleware = m;
        options = o;
    });
});

const MOCK_OPTIONS = {
    id: 'foo',
    key: 'bar',
    origin: 'http://foo.com',
    port: 1000,
    algorithm: 'aes128',
    prefix: 'session-',
    encryptPayload: false
};

const MOCK_EXPECTION = {
    options: {
        id: 'foo',
        key: 'bar',
        algorithm: 'aes128',
        encryptPayload: false
    },
    origin: 'http://foo.com',
    port: 1000,
    prefix: 'session-'
};

describe('hawk command', () => {
    beforeEach(() => {
        options = null;
        middleware = null;
        jest.doMock(configPath, () => {
            return {};
        }, {virtual: true});
    });

    afterAll(() => {
        jest.unmock(startServer);
        jset.unmock(configPath);
    });

    it('should parse options correctly', () => {
        hawkAction({})
        // equals default options
        expect(options).toEqual({
            options: {
                algorithm: 'sha256',
                encryptPayload: true
            },
            origin: 'http://127.0.0.1:8000',
            prefix: '',
        });
    });

    it('should merge options properly', () => {
        hawkAction(MOCK_OPTIONS);
        expect(options).toEqual(MOCK_EXPECTION);
    });

    it('should load config file properly', () => {
        let filePath = 'tmp.bridgit.json';
        fs.writeFileSync(path.resolve(filePath), JSON.stringify(MOCK_OPTIONS), {
            encoding: 'utf-8',
        });
        hawkAction({
            config: filePath
        });
        expect(options).toEqual(MOCK_EXPECTION);
    });

    it('throws when option is not an object', () => {
        expect(() => {
            hawkAction('foo');
        }).toThrow();
    });
});