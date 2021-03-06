#!/usr/bin/env node
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { generateDiff } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('testing complex files', () => {
  test('complex json compare', () => {
    const filepath1 = getFixturePath('complex1.json');
    const filepath2 = getFixturePath('complex2.json');

    const testedString = generateDiff(filepath1, filepath2);
    const referenceString = readFile('complexCompare.txt');

    expect(testedString).toMatch(referenceString);
  });

  test('complex yaml compare', () => {
    const filepath1 = getFixturePath('complex1.yml');
    const filepath2 = getFixturePath('complex2.yml');

    const testedString = generateDiff(filepath1, filepath2);
    const referenceString = readFile('complexCompare.txt');

    expect(testedString).toMatch(referenceString);
  });
});
