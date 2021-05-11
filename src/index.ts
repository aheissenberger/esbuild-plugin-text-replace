import * as fs from 'fs/promises'
import 'ts-replace-all'

type replacePattern = [RegExp | string, string]

interface optionI {
    include: RegExp,
    namespace?: string,
    pattern: replacePattern[]
}

const generateFilter = (options) => {
    if (Object.prototype.toString.call(options.include) !== '[object RegExp]') {
        console.warn(`Options.include must be a RegExp object, but gets an '${typeof options.include}' type.`);
        return /.*/
    }
    return options.include;
}

const replaceWithPattern = (source: string, pattern: replacePattern[]) => {
    let content= source.slice()
    pattern.forEach(([regex, replaceString]) => {
        content=content.replaceAll(regex, replaceString)
    });
    return content
}

const setupPlugin = (filter:RegExp, namespace, pattern:replacePattern[], errors) => {
    return {
        name: 'textReplace',
        setup(build) {
            if (errors.length === 0) {
                build.onLoad({ filter, namespace }, async ({ path }) => {
                    const source = await fs.readFile(path, "utf8");
                    const contents = replaceWithPattern(source, pattern)
                    return { contents };
                })
            }
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
        //console.error(`Options.pattern must be an Array!`)
        errors.push({ text: `Plugin "textReplace": Options.pattern must be an Array!` })
        return setupPlugin(filter, namespace, options.pattern, errors)
    }
    if (options.pattern.length === 0) {
        //console.error(`Options.pattern must not be an empty Array!`)
        errors.push({ text: `Plugin "textReplace": Options.pattern must not be an empty Array!` })
        return setupPlugin(filter, namespace, options.pattern, errors)
    }

    return setupPlugin(filter, namespace, options.pattern, errors)
}
export default textReplace