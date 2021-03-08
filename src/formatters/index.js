import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

function getFormatterByName(funcName) {
  switch (funcName) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    case 'json':
      return json;
    default:
      return stylish;
  }
}

export default getFormatterByName;
