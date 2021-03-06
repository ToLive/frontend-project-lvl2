import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const getFileExt = (filePath) => path.extname(filePath);

const parseFile = (filePath) => {
  if (getFileExt(filePath) === '.json') {
    return JSON.parse(fs.readFileSync(filePath));
  }

  if (getFileExt(filePath) === '.yml') {
    return yaml.load(fs.readFileSync(filePath));
  }

  throw new Error('Unknown ext');
};

export default parseFile;
