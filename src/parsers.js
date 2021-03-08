import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const getFileExt = (filePath) => path.extname(filePath);

const parseFile = (filePath) => {
  const resolvedPath = path.resolve(process.cwd(), filePath);

  console.log(resolvedPath);

  switch (getFileExt(resolvedPath)) {
    case '.json':
      return JSON.parse(fs.readFileSync(resolvedPath));
    case '.yml':
      return yaml.load(fs.readFileSync(resolvedPath));
    case '.yaml':
      return yaml.load(fs.readFileSync(resolvedPath));
    default:
      throw new Error('Unknown ext');
  }
};

export default parseFile;
