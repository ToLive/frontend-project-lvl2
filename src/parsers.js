import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const getFileExt = (filePath) => path.extname(filePath);

const parseFile = (filePath) => {
  const resolvedPath = path.resolve(process.cwd(), filePath);

  if (getFileExt(resolvedPath) === '.json') {
    return JSON.parse(fs.readFileSync(resolvedPath));
  }

  if (getFileExt(resolvedPath) === '.yml') {
    return yaml.load(fs.readFileSync(resolvedPath));
  }

  throw new Error('Unknown ext');
};

export default parseFile;
