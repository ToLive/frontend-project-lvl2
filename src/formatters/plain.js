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

const isChangedObject = (type, diff) => (type === 'object' && diff === '<>');
const isChangedPrimitive = (type, diff) => (type === 'primitive' && diff === '<>');
const getValue = (val) => (_.isObject(val) ? '[complex value]' : formatStr(val));
const getPlainValue = (val) => (val === null ? null : val.toString());

const format = (inputDiff) => {
  const iter = (currentValue, currentPath = []) => {
    const getObjectValue = (val, name) => `${_.isObject(val) ? iter(Object.entries(val), [...currentPath, name]) : formatStr(val)}`;

    if (!_.isObject(currentValue)) {
      return getPlainValue(currentValue);
    }

    const buildNewKey = (type, diff, path) => (isChangedObject(type, diff)
      ? ''
      : `Property '${path.join('.')}'`);

    const buildNewValue = (val, name, type, diff, valLeft, valRight) => {
      if (diff === '-') {
        return ` ${formatDiff(type, diff)}`;
      }

      const diffStr = isChangedObject(type, diff) ? '' : ` ${formatDiff(type, diff)}`;

      if (isChangedPrimitive(type, diff) && !_.isObject(valRight)) {
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
