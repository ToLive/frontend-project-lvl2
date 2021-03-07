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

const format = (inputDiff) => {
  const iter = (currentValue, depth, currentPath = []) => {
    const formatStr = (str) => {
      if (str === null) {
        return null;
      }

      return (typeof str === 'string' ? `'${str}'` : str.toString());
    };

    const getObjectValue = (val, dep, name) => `${_.isObject(val) ? iter(Object.entries(val), dep + 1, [...currentPath, name]) : formatStr(val)}`;
    const getValue = (val) => (_.isObject(val) ? '[complex value]' : formatStr(val));
    const getPlainValue = (val) => (val === null ? null : val.toString());

    if (!_.isObject(currentValue)) {
      return getPlainValue(currentValue);
    }

    const buildNewKey = (val, type, diff, path) => {
      if (type === 'object' && diff === '<>') {
        return '';
      }

      return `Property '${_.isArray(path) ? path.join('.') : path}'`;
    };

    const buildNewValue = (val, name, dep, type, diff, valLeft, valRight) => {
      if (diff === '-') {
        return ` ${formatDiff(type, diff)}`;
      }

      const diffStr = (type === 'object' && diff === '<>') ? '' : ` ${formatDiff(type, diff)}`;

      if (type === 'primitive' && diff === '<>'
        && (!_.isObject(valRight))) {
        return ` ${formatDiff(type, diff)}From ${getValue(valLeft, dep, name)} to ${getObjectValue(valRight, dep, name)}`;
      }

      return `${diffStr}${_.isArray(val) ? iter(val, dep + 1, [...currentPath, name]) : iter(getValue(val, dep, name), 1)}`;
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

      if (diff === '=') {
        return undefined;
      }

      const newKey = buildNewKey(name, type, diff, [...currentPath, name]);
      const newValue = buildNewValue(value, name, depth, type, diff, valueLeft, valueRight);

      return `${newKey}${newValue}`;
    });

    return [
      ...lines,
    ].filter((item) => item !== undefined).join('\n');
  };

  return iter(inputDiff, 1);
};

export default format;
