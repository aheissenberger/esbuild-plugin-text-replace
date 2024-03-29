import * as fsold from 'fs'
import 'ts-replace-all'

type replacePattern = [RegExp | string, string | any]

const fs = fsold.promises
export interface optionI {
    include?: RegExp,
    namespace?: string,
    pattern: replacePattern[]
}

interface pipeI {
    transform?: null | {
        contents: string
        args: { path: string, namespace: string, suffix: string, pluginData: any }
    }
}

const generateFilter = (options: optionI) => {
    if (Object.prototype.toString.call(options.include) !== '[object RegExp]') {
        console.warn(`Plugin "textReplace": Options.include must be a RegExp object, but gets an '${typeof options.include}' type. \nThis request will match ANY file!`);
        return /.*/
    }
    return options.include;
}

const replaceWithPattern = (source: string, pattern: replacePattern[]) => {
    let content = source.slice()
    pattern.forEach(([regex, replacer]) => {
        content = content.replaceAll(regex, replacer)
    });
    return content
}

const setupPlugin = (filter: RegExp|undefined, namespace: string | undefined, pattern: replacePattern[], errors: any[]) => {
    return {
        name: 'textReplace',
        setup(build, { transform = null }: pipeI = {}): { contents: string } | undefined {

            if (transform) {
                if (transform?.contents && (namespace === undefined || namespace === '' || transform?.args?.namespace === namespace) && (filter === undefined || filter.test(transform?.args?.path))) {
                    const source = transform.contents
                    const contents = replaceWithPattern(source, pattern)
                    return { contents };
                } else {
                    return { contents: transform.contents };
                }
            };

            build.onLoad({ filter, namespace }, async ({ path }) => {
                const source = await fs.readFile(path, "utf8");
                const contents = replaceWithPattern(source, pattern)
                return { contents };
            })
        }
    }
}

function textReplace(options: optionI = {
    include: /.*/,
    pattern: []
}) {
    let errors = []
    const filter = generateFilter(options)
    const namespace = options?.namespace

    if (!Array.isArray(options.pattern)) {
        throw new Error(`Plugin "textReplace": Options.pattern must be an Array!`)

    }
    if (options.pattern.length === 0) {
        throw new Error(`Plugin "textReplace": Options.pattern must not be an empty Array!`)
    }

    return setupPlugin(filter, namespace, options.pattern, errors)
}
export default textReplace