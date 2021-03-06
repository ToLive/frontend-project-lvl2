import _ from 'lodash';

function formatDiff(valueType, diffType) {
  if (diffType === '+') {
    return '+ ';
  }

  if (diffType === '-') {
    return '- ';
  }

  if (valueType === 'primitive') {
    if (diffType === '<>') {
      return '- ';
    }
  }

  return '  ';
}

const format = (inputDiff, replacer = '    ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    const getObjectValue = (val, dep) => `${_.isObject(val) ? iter(Object.entries(val), dep + 1) : val}`;
    const getValue = (val) => (_.isObject(val) ? Object.entries(val) : val);

    if (currentValue === null) {
      return 'null';
    }

    if (!_.isObject(currentValue)) {
      return currentValue.toString();
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize).slice(0, -2);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    const lines = currentValue.map((item) => {
      const {
        name,
        type,
        diff,
        value,
        valueLeft,
        valueRight,
      } = item;

      if (!type) {
        return `${currentIndent}  ${item[0]}: ${getObjectValue(item[1], depth)}`;
      }

      const newKey = `${currentIndent}${formatDiff(type, diff)}${name}`;

      let newValue = `${_.isArray(value) ? iter(value, depth + 1) : iter(getValue(value), depth + 1)}`;

      if (type === 'primitive' && diff === '<>'
        && (!_.isObject(valueRight))) {
        newValue = `${getObjectValue(valueLeft, depth)}\n${currentIndent}+ ${name}: ${getObjectValue(valueRight, depth)}`;
      }

      return `${newKey}: ${newValue}`;
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(inputDiff, 1);
};

export default format;
