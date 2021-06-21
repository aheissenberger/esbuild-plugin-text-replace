import * as fsold from 'fs'
import 'ts-replace-all'

type replacePattern = [RegExp | string, string | any]

const fs = fsold.promises
export interface optionI {
    include?: RegExp,
    namespace?: string,
    pattern: replacePattern[]
}

const generateFilter = (options) => {
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

const setupPlugin = (filter: RegExp, namespace, pattern: replacePattern[], errors) => {
    return {
        name: 'textReplace',
        setup(build) {

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