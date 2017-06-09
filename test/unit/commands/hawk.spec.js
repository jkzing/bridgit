require('assert');

const path = require('path');
const os = require('os');
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
        expect(options).toEqual({
            options: {
                algorithm: 'sha256',
                encryptPayload: true
            },
            origin: 'http://127.0.0.1:8000',
            prefix: '',
        });
    });
    it('throws when option is not an object', () => {
        expect(() => {
            hawkAction('foo');
        }).toThrow();
    });
});