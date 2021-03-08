#!/usr/bin/env node
import program from 'commander';
import generateDiff from '../src/index.js';

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name(),
});

program.version('0.0.2');

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .allowUnknownOption()
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, args) => {
    //console.dir(program);
    const res = generateDiff(filepath1, filepath2, args.format);

    console.dir(res);
  });

program.parse(process.argv);
