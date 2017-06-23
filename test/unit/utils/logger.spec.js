require('assert');
jest.mock('chalk', () => {
    return {
        yellow: jest.fn(),
        cyan: jest.fn(),
    }
});

const chalk = require('chalk');
const {requireSrc} = require('../../helpers');

const {colorful} = requireSrc('utils/logger');

describe('util logger', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.unmock('chalk');
    });

    test('colorful log yellow in color with 1 argument', () => {
        colorful('foo');
        expect(chalk.yellow.mock.calls.length).toBe(1)
    });

    test('colorful log with right color and right timestamp', () => {
        colorful('foo', 'cyan', true);
        expect(chalk.cyan.mock.calls.length).toBe(1);
        expect(chalk.cyan.mock.calls[0][0]).toMatch(/\[.+\] -/);
    })
});