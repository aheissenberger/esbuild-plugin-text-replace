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
    let content: string = Object.assign("", source);
    pattern.forEach(([regex, replaceString]) => {
        content.replaceAll(regex, replaceString)
    });
    return content
}



function main(options: optionI = {
    include: /.*/,
    pattern: []
}) {
    const filter = generateFilter(options)
    const namespace = options?.namespace

    return {
        name: 'textReplace',
        setup(build) {
            build.onLoad({ filter }, namespace, async ({ path }) => {
                const source = await fs.readFile(path, "utf8");
                const contents = replaceWithPattern(source, options.pattern)
                return { contents };
            })
        }
    }
}
export default main