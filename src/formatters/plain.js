import _ from 'lodash';

function formatDiff(valueType, diffType) {
  if (diffType === '+') {
    return 'was added with value: ';
  }

  if (diffType === '-') {
    return 'was removed';
  }

  if (valueType === 'primitive') {
    if (diffType === '<>') {
      return 'was updated. ';
    }
  }

  return 'was not changed';
}

const formatStr = (str) => {
  if (str === null) {
    return null;
  }

  return (typeof str === 'string' ? `'${str}'` : str.toString());
};

const format = (inputDiff) => {
  const iter = (currentValue, currentPath = []) => {
    const getObjectValue = (val, name) => `${_.isObject(val) ? iter(Object.entries(val), [...currentPath, name]) : formatStr(val)}`;
    const getValue = (val) => (_.isObject(val) ? '[complex value]' : formatStr(val));
    const getPlainValue = (val) => (val === null ? null : val.toString());

    if (!_.isObject(currentValue)) {
      return getPlainValue(currentValue);
    }

    const buildNewKey = (type, diff, path) => ((type === 'object' && diff === '<>')
      ? ''
      : `Property '${_.isArray(path) ? path.join('.') : path}'`);

    const buildNewValue = (val, name, type, diff, valLeft, valRight) => {
      if (diff === '-') {
        return ` ${formatDiff(type, diff)}`;
      }

      const diffStr = (type === 'object' && diff === '<>') ? '' : ` ${formatDiff(type, diff)}`;

      if (type === 'primitive' && diff === '<>' && (!_.isObject(valRight))) {
        return ` ${formatDiff(type, diff)}From ${getValue(valLeft, name)} to ${getObjectValue(valRight, name)}`;
      }

      return `${diffStr}${_.isArray(val) ? iter(val, [...currentPath, name]) : iter(getValue(val, name), 1)}`;
    };

    const lines = currentValue
      .map((item) => {
        const {
          name,
          type,
          diff,
          value,
          valueLeft,
          valueRight,
        } = item;

        const newKey = buildNewKey(type, diff, [...currentPath, name]);
        const newValue = buildNewValue(value, name, type, diff, valueLeft, valueRight);

        return (diff === '=')
          ? undefined
          : `${newKey}${newValue}`;
      })
      .filter((item) => item !== undefined);

    return [
      ...lines,
    ].join('\n');
  };

  return iter(inputDiff);
};

export default format;
