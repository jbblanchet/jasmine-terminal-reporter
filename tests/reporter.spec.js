/* jshint mocha: true */

'use strict';

var assert = require('assert');
var Reporter = require('../index');

describe('The reporter', function () {
    describe('constructor', function () {
        it('accepts undefined option parameter', function () {
            var reporter = new Reporter();

            assert.strictEqual(typeof reporter.jasmineStarted, 'function');
        });
    });

    describe('timer', function () {
        it('is started with jasmine', function () {
            var started = false;

            var testTimer = {
                start: function () {
                    started = true;
                }
            };

            var reporter = new Reporter({
                timer: testTimer
            });

            reporter.jasmineStarted();

            assert.strictEqual(started, true);
        });

        it('is checked when jasmine is done', function () {
            var called = false;
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var testTimer = {
                elapsed: function () {
                    called = true;
                }
            };

            var reporter = new Reporter({
                timer: testTimer,
                print: print
            });

            reporter.jasmineDone();

            assert.strictEqual(called, true);
        });
    });

    describe('jasmineStarted', function () {
        it('displays nothing when not in verbose mode', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.jasmineStarted({
                totalSpecsDefined: 8
            });

            assert.strictEqual(printed, '');
        });

        it('displays the total number of specs when in verbose mode (single)', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.jasmineStarted({
                totalSpecsDefined: 1
            });

            assert.strictEqual(printed, 'Running 1 spec.\n');
        });

        it('displays the total number of specs when in verbose mode (plural)', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.jasmineStarted({
                totalSpecsDefined: 8
            });

            assert.strictEqual(printed, 'Running 8 specs.\n');
        });
    });

    describe('suiteStarted', function () {
        it('displays nothing when not in verbose mode', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.suiteStarted({
                description: 'a good suite'
            });

            assert.strictEqual(printed, '');
        });

        it('displays the name of the suite when in verbose mode', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.suiteStarted({
                description: 'a good suite'
            });

            assert.strictEqual(printed, 'a good suite\n');
        });

        it('indents the output correctly on nested suites', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.suiteStarted({
                description: 'a good suite'
            });

            reporter.suiteStarted({
                description: 'a better suite'
            });

            reporter.suiteStarted({
                description: 'the best suite'
            });

            assert.strictEqual(printed, 'a good suite\n  a better suite\n    the best suite\n');
        });
    });

    describe('suiteDone', function () {
        it('displays nothing when not in verbose mode', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.suiteDone();

            assert.strictEqual(printed, '');
        });

        it('displays nothing when in verbose mode', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.suiteDone();

            assert.strictEqual(printed, '');
        });

        it('decrements correctly on nested suites', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                isVerbose: true
            });

            reporter.suiteStarted({
                description: 'a good suite'
            });

            reporter.suiteStarted({
                description: 'a better suite'
            });

            reporter.suiteStarted({
                description: 'the best suite'
            });

            reporter.suiteDone();
            reporter.suiteDone();

            reporter.suiteStarted({
                description: 'a worse suite'
            });

            reporter.suiteDone();
            reporter.suiteDone();

            reporter.suiteStarted({
                description: 'the worst suite'
            });

            assert.strictEqual(printed, 'a good suite\n  a better suite\n    the best suite' +
                '\n  a worse suite\nthe worst suite\n');
        });
    });

    describe('specDone', function () {
        describe('non verbose mode', function () {
            it('displays a passed spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print
                });

                reporter.specDone({ status: 'passed' });

                assert.strictEqual(printed, '\x1B[32m.\x1B[0m');
            });

            it('displays a pending spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print
                });

                reporter.specDone({ status: 'pending' });

                assert.strictEqual(printed, '\x1B[33m*\x1B[0m');
            });

            it('displays a failed spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print
                });

                reporter.specDone({ status: 'failed', failedExpectations: [] });

                assert.strictEqual(printed, '\x1B[31mF\x1B[0m');
            });

            it('displays nothing on invalid state', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print
                });

                reporter.specDone({ status: 'other' });

                assert.strictEqual(printed, '');
            });
        });

        describe('verbose mode', function () {
            it('displays a passed spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print,
                    isVerbose: true
                });

                reporter.specDone({ description: 'a spec that passes', status: 'passed' });

                assert.strictEqual(printed, '\x1B[32m  a spec that passes: passed\x1B[0m\n');
            });

            it('displays a pending spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print,
                    isVerbose: true
                });

                reporter.specDone({ description: 'a pending spec', status: 'pending' });

                assert.strictEqual(printed, '\x1B[33m  a pending spec: pending\x1B[0m\n');
            });

            it('displays a failed spec correctly', function () {
                var printed = '';
                var print = function (str) {
                    printed += str;
                };

                var reporter = new Reporter({
                    print: print,
                    isVerbose: true
                });

                reporter.specDone({ description: 'a spec that fails', status: 'failed', failedExpectations: [] });

                assert.strictEqual(printed, '\x1B[31m  a spec that fails: failed\x1B[0m\n');
            });
        });
    });

    describe('jasmineDone', function () {
        it('reports failed specs correcly', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a spec that fails',
                fullName: 'a suite with a spec that fails',
                status: 'failed',
                failedExpectations: [
                    { message: 'message 1' },
                    { message: 'message 2' }
                ] });
            reporter.specDone({
                description: 'a spec that fails 2',
                fullName: 'a suite with a spec that fails 2',
                status: 'failed',
                failedExpectations: [{ message: 'message 3' }] });

            printed = '';

            reporter.jasmineDone();

            assert.strictEqual(printed, '\n' +
                'Failures: \n' +
                '1) a suite with a spec that fails\n' +
                '1.1) \x1B[31mmessage 1\x1B[0m\n' +
                '1.2) \x1B[31mmessage 2\x1B[0m\n' +
                '\n' +
                '2) a suite with a spec that fails 2\n' +
                '2.1) \x1B[31mmessage 3\x1B[0m\n' +
                '\n' +
                '2 specs, 2 failures\n' +
                'Finished in 0 seconds\n');
        });

        it('reports failed specs with a stack trace correctly', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                includeStackTrace: true
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a spec that fails',
                fullName: 'a suite with a spec that fails',
                status: 'failed',
                failedExpectations: [{
                    message: 'message 1',
                    stack: 'test stack\nwith a lot of lines'
                }]
            });

            printed = '';

            reporter.jasmineDone();

            assert.strictEqual(printed, '\n' +
                'Failures: \n' +
                '1) a suite with a spec that fails\n' +
                '1.1) \x1B[31mmessage 1\x1B[0m\n' +
                '    test stack\n' +
                '    with a lot of lines\n' +
                '\n' +
                '1 spec, 1 failure\n' +
                'Finished in 0 seconds\n');
        });

        it('reports pending specs correcly', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a pending spec',
                fullName: 'a suite with a pending spec',
                status: 'pending'
            });

            printed = '';

            reporter.jasmineDone();

            assert.strictEqual(printed, '\n' +
                '1 spec, 0 failures, 1 pending spec\n' +
                'Finished in 0 seconds\n');

        });

        it('reports passed specs correctly', function () {
            var printed = '';
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a spec that passes',
                fullName: 'a suite a spec that passes',
                status: 'passed'
            });

            printed = '';

            reporter.jasmineDone();

            assert.strictEqual(printed, '\n' +
                '1 spec, 0 failures\n' +
                'Finished in 0 seconds\n');

        });

        it('calls done with success', function () {
            var printed = '';
            var success = null;
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                done: function (result) {
                    success = result;
                }
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a spec that passes',
                fullName: 'a suite a spec that passes',
                status: 'passed'
            });

            printed = '';

            reporter.jasmineDone();

            assert.strictEqual(success, true);
        });

        it('calls done with failure', function () {
            var printed = '';
            var success = null;
            var print = function (str) {
                printed += str;
            };

            var reporter = new Reporter({
                print: print,
                done: function (result) {
                    success = result;
                }
            });

            reporter.jasmineStarted();

            reporter.specDone({
                description: 'a spec that fails',
                fullName: 'a suite with a spec that fails',
                status: 'failed',
                failedExpectations: [
                    { message: 'message 1' },
                    { message: 'message 2' }
                ] });

            reporter.jasmineDone();

            assert.strictEqual(success, false);
        });
    });
});
