import stylish from './stylish.js';
import plain from './plain.js';

function getFormatterByName(funcName) {
  switch (funcName) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      return stylish;
  }
}

export default getFormatterByName;
