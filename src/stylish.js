import _ from 'lodash';

const format = (value, replacer = '    ', spacesCount = 1) => {
  function formatDiff(valueType, diffType) {
    if (diffType === '+') {
      return '+ ';
    }

    if (diffType === '-') {
      return '- ';
    }

    if (valueType === 'primitive') {
      if (diffType === '<>') {
        return '<>';
      }
    }

    return '  ';
  }

  const iter = (currentValue, depth) => {
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
      if (!item.type) {
        return `${currentIndent}  ${item[0]}: ${_.isObject(item[1]) ? iter(Object.entries(item[1]), depth + 1) : item[1]}`;
      }

      let newKey = `${currentIndent}${formatDiff(item.type, item.diff)}${item.name}`;

      let newValue = `${_.isArray(item.value) ? iter(item.value, depth + 1) : iter(_.isObject(item.value) ? Object.entries(item.value) : item.value, depth + 1)}`;

      if (item.type === 'primitive' && item.diff === '<>'
        && (!_.isObject(item.valueRight))) {
        newKey = `${currentIndent}- ${item.name}`;
        newValue = `${_.isObject(item.valueLeft) ? iter(Object.entries(item.valueLeft), depth + 1) : item.valueLeft}\n${currentIndent}+ ${item.name}: ${_.isObject(item.valueRight) ? iter(Object.entries(item.valueRight), depth + 1) : item.valueRight}`;
      }

      return `${newKey}: ${newValue}`;
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};

export default format;
