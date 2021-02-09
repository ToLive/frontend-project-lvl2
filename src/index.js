import program from 'commander';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const genDiff = () => {
  program.configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => cmd.name(),
  });

  program.version('0.0.1');

  program
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format')
    .action((path1, path2) => {
      const fullPathToFile1 = path.resolve(process.cwd(), path1);
      const fullPathToFile2 = path.resolve(process.cwd(), path2);

      const file1Content = JSON.parse(fs.readFileSync(fullPathToFile1));
      const file2Content = JSON.parse(fs.readFileSync(fullPathToFile2));
      const file1Keys = Object.keys(file1Content);
      const file2Keys = Object.keys(file2Content);

      const mergedFile = Object.values(_.union(file1Keys, file2Keys));

      const resArray = _.sortBy(mergedFile).reduce((acc, key) => {
        const file1value = file1Content[key];
        const file2value = file2Content[key];

        if (file1value === file2value) {
          return [...acc, `   ${key}: ${file1value}`];
        }

        if (_.has(file1Content, key) && !file2value) {
          return [...acc, `  - ${key}: ${file1value}`];
        }

        if (_.has(file1Content, key)
            && _.has(file2Content, key)
            && file1value !== file2value) {
          return [...acc, `  - ${key}: ${file1value}`, `  + ${key}: ${file2value}`];
        }

        if (_.has(file2Content, key) && !file1value) {
          return [...acc, `  + ${key}: ${file2value}`];
        }

        return acc;
      }, []);

      console.log(`{ \n${resArray.join('\n')}\n}`);
    });

  program.parse();
};

export default genDiff;
