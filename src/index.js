#!/usr/bin/env node
// Handling commands and calling the appropriate functions from core.

// TODO: Nodejs init and load json file (or create one)
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addShortcut,
  checkShortcut,
  deleteShortcut,
  goto,
  listShortcuts,
  updateEntry,
} from "./core.js";

const __dirname = process.cwd();

yargs()
  .command(
    "$0 <name>",
    "Jump to shortcut",
    (yargs) => {
      yargs.positional("name", {
        describe: "Shortcut name",
      });
    },
    (argv) => {
      goto(argv.name);
    }
  )

  .command(
    "add",
    "Add a new shortcut",
    {
      name: {
        alias: "n",
      },
      path: {
        alias: "p",
      },
    },
    (argv) => {
      let path = argv.path;
      if (argv.path == ".") {
        path = __dirname;
      }
      addShortcut(argv.name, path);
    }
  )

  .command(
    "list",
    "List all your shortcuts",
    () => {},
    () => {
      listShortcuts();
    }
  )

  .command(
    "delete <query>",
    "Delete a shortcut entry by name or path",
    (yargs) => {
      yargs.positional("query", { describe: "Shortcut name or path" });
    },
    (argv) => {
      let query = argv.query;
      if (argv.query == ".") {
        query = __dirname;
      }
      deleteShortcut(query);
    }
  )

  .command(
    "check <query>",
    "Check if current path has a shortcut",
    (yargs) => {
      yargs.positional("query", { describe: "Path or name to check" });
    },
    (argv) => {
      let query = argv.query;
      if (argv.query == ".") {
        query = __dirname;
      }
      checkShortcut(query);
    }
  )

  .command(
    "update <query>",
    "Update an existing entry",
    (yargs) => {
      yargs
        .positional("query", { describe: "Query to use for finding the entry" })
        .options({
          name: {
            alias: "n",
            describe: "Shortcut name",
          },
          path: {
            alias: "p",
            describe: "Shortcut path",
          },
        });
    },
    (argv) => {
      if (!argv.name && !argv.path) {
        console.error(
          "Please, provide -n or -p to define which value will be updated"
        );
        return;
      }

      if (argv.path == ".") {
        argv.path = __dirname;
      }
      updateEntry(argv.query, argv.name, argv.path);
    }
  )

  .help()
  .parse(hideBin(process.argv));
