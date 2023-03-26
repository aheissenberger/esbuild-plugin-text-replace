import textReplace, { optionI } from '../src/index'
import * as fsmock from 'mock-fs'

const buildMock = (path, cb) => ({
    onLoad: async (para, callback) => {
        const content = await callback({ path })
        cb(content)
    }
})

describe('configuration has', () => {

    beforeEach(() => {
        fsmock(
            {
                'loader.js': 'A',
                'lib.js': 'const a=1; a=2;',
                'path/to/fake/date.js': '_2020-02-01_'
            }
        )
    })

    afterEach(fsmock.restore);

    it('is minimal pattern', (doneTest) => {
        const setup: optionI = {
            pattern: [
                ['A', 'B']
            ]
        }
        const expected = 'B'

        const plugin = textReplace(setup)

        plugin.setup(buildMock('loader.js', (data) => {
            expect(data.contents).toBe(expected)
            doneTest()
        }))

    })

    it('empty pattern array', () => {
        const setup: optionI = {
            pattern: [

            ]
        }

        expect(() => {
            const plugin = textReplace(setup)
        }).toThrow();
    })

    it('regex pattern', (doneTest) => {
        const setup: optionI = {
            pattern: [
                [/(\s*)const(\s+a\s*=\s*1[\s;\n])/g, '$1let$2']
            ]
        }
        const expected = 'let a=1; a=2;'

        const plugin = textReplace(setup)

        plugin.setup(buildMock('lib.js', (data) => {
            expect(data.contents).toBe(expected)
            doneTest()
        }))

    })

    it('function pattern', (doneTest) => {
        const setup: optionI = {
            include: /fake\/date\.js$/,
            pattern: [

                [/(\d{4})-(\d{2})-(\d{2})/g, (match, p1, p2, p3, offset, wholeString) => `${p3}.${p2}.${p1}`]
            ]
        }
        const expected = '_01.02.2020_'

        const plugin = textReplace(setup)

        plugin.setup(buildMock('path/to/fake/date.js', (data) => {
            expect(data.contents).toBe(expected)
            doneTest()
        }))

    })
    describe('pipe', () => {
        it('pipe ', () => {
            const setup: optionI = {
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'B'

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })

        it('pipe with file included', () => {
            const setup: optionI = {
                include: /loader.js$/,
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'B'

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })

        it('pipe with file included namespace file', () => {
            const setup: optionI = {
                namespace: 'file',
                include: /loader.js$/,
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'B'

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })

        it('pipe with file included namespace file', () => {
            const setup: optionI = {
                namespace: '',
                include: /loader.js$/,
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'B'

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })

        it('pipe with file included namespace http', () => {
            const setup: optionI = {
                namespace: 'http',
                include: /loader.js$/,
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'A' // no transformation

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })

        it('pipe with file not include', () => {
            const setup: optionI = {
                include: /notextists.js$/,
                pattern: [
                    ['A', 'B']
                ]
            }
            const expected = 'A'  // no transformation

            const plugin = textReplace(setup)

            const result = plugin.setup(null, {
                transform: {
                    args: {
                        path: '/directory/loader.js',
                        namespace: 'file',
                        suffix: '',
                        pluginData: undefined
                    },
                    contents: 'A'
                }
            })
            expect(result?.contents).toBe(expected)
        })
    })
})