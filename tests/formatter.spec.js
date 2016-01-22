/* jshint mocha: true */

'use strict';

var assert = require('assert');
var Formatter = require('../formatter');

describe('The formatter', function () {
    describe('constructor', function () {
        it('accepts undefined option parameter', function () {
            var formatter = new Formatter();

            assert.strictEqual(formatter.showColors, true);
            assert.strictEqual(typeof formatter.formatStack, 'function');
            assert.strictEqual(typeof formatter.print, 'function');
        });

        it('accepts a custom print function', function () {
            var called = 0;
            var testFunction = function (value) {
                called += value;
            };

            var formatter = new Formatter({
                print: testFunction
            });

            formatter.print(1);

            assert.strictEqual(called, 1);
        });

        it('accepts a custom stack formatter', function () {
            var called = 0;
            var testFunction = function (value) {
                called += value;
            };

            var formatter = new Formatter({
                stackFilter: testFunction
            });

            formatter.formatStack(1);

            assert.strictEqual(called, 1);
        });

        it('accepts a boolean for showColors', function () {

            var formatter1 = new Formatter({
                showColors: false
            });

            var formatter2 = new Formatter({
                showColors: true
            });

            var formatter3 = new Formatter();

            assert.strictEqual(formatter1.showColors, false);
            assert.strictEqual(formatter2.showColors, true);
            assert.strictEqual(formatter3.showColors, true);
        });
    });

    describe('stack filter', function () {
        it('returns the full message by default', function () {
            var formatter = new Formatter();
            try {
                throw new Error('complete message');
            } catch (err) {
                assert.strictEqual(formatter.formatStack(err.stack), err.stack);
            }
        });
    });

    describe('print method', function () {
        it('use stdout by default', function () {
            var formatter = new Formatter();
            var called = null;

            var out = process.stdout.write.bind(process.stdout);
            process.stdout.write = function (str) {
                called = str;
            };

            formatter.print('test value');

            assert(called, 'test value');
            process.stdout.write = out;
        });
    });

    describe('printNewline method', function () {
        it('calls print with a new line character', function () {
            var called = 0;
            var testFunction = function (value) {
                called = value;
            };

            var formatter = new Formatter({
                print: testFunction
            });

            formatter.printNewline();

            assert.strictEqual(called, '\n');
        });
    });

    describe('pluralize method', function () {
        it('adds an s if count !> 1', function () {
            var formatter = new Formatter();
            assert.strictEqual(formatter.pluralize('test', 2), 'tests');
            assert.strictEqual(formatter.pluralize('test', 0), 'tests');
            assert.strictEqual(formatter.pluralize('test', -1000), 'tests');
        });

        it('doesn\'t add an s if count == 1', function () {
            var formatter = new Formatter();
            assert.strictEqual(formatter.pluralize('test', 1), 'test');
        });
    });

    describe('colorize method', function () {
        it('colors correctly if showColors is true', function () {
            var formatter = new Formatter();
            var colored = formatter.colorize('green', 'test');
            assert.strictEqual(colored, '\x1B[32m' + 'test' + '\x1B[0m');
        });

        it('doesn\'t color if showColors is false', function () {
            var formatter = new Formatter({
                showColors: false
            });
            var colored = formatter.colorize('green', 'test');
            assert.strictEqual(colored, 'test');
        });
    });

    describe('indent method', function () {
        it('indents correctly with 0', function () {
            var formatter = new Formatter();
            var indented = formatter.indent('line1\nline2\nline3', 0);
            assert.strictEqual(indented, 'line1\nline2\nline3');
        });

        it('indents correctly with > 0', function () {
            var formatter = new Formatter();
            var indented = formatter.indent('line1\nline2\nline3', 2);
            assert.strictEqual(indented, '  line1\n  line2\n  line3');
        });
    });
});
