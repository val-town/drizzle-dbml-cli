## drizzle-dmbl-cli

You have a [drizzle-orm](https://github.com/drizzle-team/drizzle-orm) schema and want to
visualize it. There's a fantastic module for doing that,
[drizzle-dbml-generator](https://github.com/L-Mario564/drizzle-dbml-generator). This module
provides a simple CLI on top of that module to make it faster to use.

This module provides:

- Automatic TypeScript support (with [tsx](https://npmjs.com/tsx))
- Detection for what kind of Drizzle schema you have (Postgres, SQLite, and MySQL supported)
- Writing to stdout or a file
- Support for writing SVG or DOT output, using [dbml-renderer](https://github.com/softwaretechnik-berlin/dbml-renderer)

```sh
npx drizzle-dbml-cli db/schema.ts
```

### Help

```
  A quick and dirty CLI for drizzle-dbml-generator

  Usage
    $ drizzle-dbml-cli <input>

  Options
    --type, -t      Explicit type: one of sqlite, mysql, or pg
                     If not provided, it'll be auto-detected

    -o              Save output to the given output file
                     instead of writing to stdout

    --verbose, -v   Verbose output
    --format, -f    Format, one of dbml, svg, or dot.

  Examples
    $ drizzle-dbml-cli db/schema.ts
```
