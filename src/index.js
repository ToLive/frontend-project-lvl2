import program from 'commander';
import _ from 'lodash';
import parseFile from './parsers.js';
import stylish from './stylish.js';

function deepSortObject(obj) {
  function defaultSortFn(a, b) {
    return a.localeCompare(b);
  }

  function sort(src, comparator) {
    let out;

    if (Array.isArray(src)) {
      return src.map((item) => sort(item, comparator));
    }

    if (_.isObject(src)) {
      out = {};

      Object.keys(src).sort(comparator || defaultSortFn).forEach((key) => {
        out[key] = sort(src[key], comparator);
      });

      return out;
    }

    return src;
  }

  return sort(obj);
}

function diffType(left, right) {
  if (left === undefined) {
    return '+';
  }

  if (right === undefined) {
    return '-';
  }

  if (_.isEqual(left, right)) {
    return '=';
  }

  return '<>';
}

function difference(merged, left, right) {
  const iter = (currentValue, currentKey = undefined, leftV, rightV) => {
    const valueLeft = currentKey && leftV ? leftV[currentKey] : leftV;
    const valueRight = currentKey && rightV ? rightV[currentKey] : rightV;

    const currentDiffType = diffType(valueLeft, valueRight);

    const resultValue = _.isObject(currentValue) && currentDiffType === '<>'
      ? Object
        .entries(currentValue)
        .map(([key, value]) => iter(value, key, valueLeft, valueRight))
      : currentValue;

    const result = {
      name: currentKey,
      type: _.isObject(currentValue) ? 'object' : 'primitive',
      diff: currentDiffType,
      value: resultValue,
      valueLeft,
      valueRight,
    };

    return result;
  };

  return deepSortObject(iter(merged, null, left, right));
}

const generateDiff = (path1, path2, formatter = stylish) => {
  const file1Content = parseFile(path1);
  const file2Content = parseFile(path2);

  const mergedContent = {};
  _.merge(mergedContent, file1Content, file2Content);

  const sortedMergedContent = deepSortObject(mergedContent);

  return formatter(difference(sortedMergedContent, file1Content, file2Content).value);
};

const genDiff = (format = stylish) => {
  program.configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => cmd.name(),
  });

  program.version('0.0.2');

  program
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'stylish')
    .action((path1, path2) => {
      const res = generateDiff(path1, path2, format);

      console.log(res);
    });

  program.parse();
};

export { generateDiff };
export default genDiff;
