#!/usr/bin/env node
import Fs from "node:fs";
import meow from "meow";
import { tsImport } from "tsx/esm/api";
import {
	pgGenerate,
	mysqlGenerate,
	sqliteGenerate,
} from "drizzle-dbml-generator";

const cli = meow(
	`
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
`,
	{
		importMeta: import.meta, // This is required
		flags: {
			type: {
				type: "string",
				shortFlag: "t",
				choices: ["sqlite", "mysql", "pg"],
			},
			format: {
				type: "string",
				shortFlag: "f",
				choices: ["dbml", "svg", "dot"],
			},
			o: {
				type: "string",
			},
			verbose: {
				type: "boolean",
				shortFlag: "v",
			},
		},
	},
);

if (!cli.input.length) {
	cli.showHelp();
}

const relational = false;
const schema = await tsImport(process.argv[2], import.meta.url);

let method = null;

function log(...input) {
	if (cli.flags.v) {
		console.error(...input);
	}
}

if (cli.flags.type) {
	method = {
		pg: pgGenerate,
		mysql: mysqlGenerate,
		sqlite: sqliteGenerate,
	}[cli.flags.type];
} else {
	for (let e of Object.values(schema)) {
		const name = e?.constructor?.name;
		if (typeof name !== "string") continue;
		if (name.startsWith("Pg")) {
			log(`Detected Postgres`);
			method = pgGenerate;
			break;
		}
		if (name.startsWith("My")) {
			log(`Detected MySQL`);
			method = mysqlGenerate;
			break;
		}
		if (name.startsWith("SQ")) {
			log(`Detected SQLite`);
			method = sqliteGenerate;
			break;
		}
	}
}

if (!method) {
	console.error("Detecting database type failed");
	process.exit(1);
}

let output = method({ schema, relational });

let format = cli.flags.format || "dbml";

if (format === "svg" || format === "dot") {
	const { run } = await import("@softwaretechnik/dbml-renderer");
	output = run(output, format);
}

if (cli.flags.o) {
	Fs.writeFileSync(cli.flags.o, output);
} else {
	process.stdout.write(output);
}
