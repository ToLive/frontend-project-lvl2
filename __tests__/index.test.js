#!/usr/bin/env node
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { generateDiff } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('testing plain json', () => {
  test('plain json compare', () => {
    const filepath1 = getFixturePath('plain1.json');
    const filepath2 = getFixturePath('plain2.json');

    const testedString = generateDiff(filepath1, filepath2);
    const referenceString = readFile('plainjsonResult.txt');

    expect(testedString).toMatch(referenceString);
  });
});
