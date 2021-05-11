# esbuild-plugin-text-replace

Replace content before bundling with support for Filefilter, Namespace and Regex.

## Install

    $ npm install --save-dev esbuild-plugin-text-replace

## Usage

```js
import esbuild from 'esbuild'
import textReplace from 'esbuild-plugin-text-replace'

await esbuild.build(
    {
        entryPoints: ['./test-build-input'],
        outfile: 'test-build-out.js',
        plugins: [
            
            textReplace(
                {
                    include: /mypackage\/dist/loader\.js$\/,
                    patterns:[
                        'const installRetry':'let installRetry',
                        /const\s+{\s*textReplace\s*}\s*=\s*require\s*\(\s*'esbuild-plugin-text-replace'\s*\)\s*;/ : "'import textReplace from 'esbuild-plugin-text-replace'"
                    ]
                }
            )
        ],
    }
)
```

## Options

### `include`

Filter filepath by regex.

Type: `RegExp`
Default: `/.*/`

> **Note:** Try to never use the default value as this is has a huge impact on speed if all files are matched!

### `namespace`

Type: `String`
Default: all

More info about [esbuild namespaces](https://esbuild.github.io/plugins/#namespaces)

### `pattern`

Search with Text or Regex and replace the found content with a string.

Type: `Array`
Default: `[]`

**Examples:**
```js
[
    /\d{4}-\d{2}-\d{2}/ : 'DATE', // replace e.g. 2020-10-02 with DATE
    '__buildVersion' : '"1.1.1"'
]
```

## Roadmap

 - [ ] speed tests
 - [ ] tests

## Contribution

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
1. Commit your Changes (git commit -m 'Add some AmazingFeature')
1. Push to the Branch (git push origin feature/AmazingFeature)
1. Open a Pull Request

## Built With

- [microbundle](https://github.com/developit/microbundle)

## License

Distributed under the "bsd-2-clause" License. See [LICENSE.txt](LICENSE.txt) for more information.



