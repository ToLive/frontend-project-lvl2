import program from 'commander';
import path from 'path';
import _ from 'lodash';
import parseFile from './parsers.js';

const generateDiff = (path1, path2) => {
  const fullPathToFile1 = path.resolve(process.cwd(), path1);
  const fullPathToFile2 = path.resolve(process.cwd(), path2);

  const file1Content = parseFile(fullPathToFile1);
  const file2Content = parseFile(fullPathToFile2);

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

  return `{ \n${resArray.join('\n')}\n}`;
};

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
      const res = generateDiff(path1, path2);

      console.log(res);
    });

  program.parse();
};

export { generateDiff };
export default genDiff;
