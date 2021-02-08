#!/usr/bin/env node

import program from 'commander';

const run = () => {
    /*program.configureHelp({
        sortSubcommands: true,
        subcommandTerm: (cmd) => cmd.name()
    });*/

    program.version('0.0.1');
    
    program
        .description('Compares two configuration files and shows a difference.')
        .arguments('<filepath1> <filepath2>')
        .option('-f, --format [type]', 'output format');

    program.parse();
};

export default run;