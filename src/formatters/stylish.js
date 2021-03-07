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
    const getPlainValue = (val) => (val === null ? null : val.toString());

    if (!_.isObject(currentValue)) {
      return getPlainValue(currentValue);
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize).slice(0, -2);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const buildNewKey = (val, type, diff) => `${currentIndent}${formatDiff(type, diff)}${val}`;

    const buildNewValue = (val, name, dep, type, diff, valLeft, valRight) => {
      if (type === 'primitive' && diff === '<>'
        && (!_.isObject(valRight))) {
        return `${getObjectValue(valLeft, dep)}\n${currentIndent}+ ${name}: ${getObjectValue(valRight, dep)}`;
      }

      return `${_.isArray(val) ? iter(val, dep + 1) : iter(getValue(val), dep + 1)}`;
    };

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
        return `${buildNewKey(item[0], 'object', '<>')}: ${getObjectValue(item[1], depth)}`;
      }

      const newKey = buildNewKey(name, type, diff);
      const newValue = buildNewValue(value, name, depth, type, diff, valueLeft, valueRight);

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
