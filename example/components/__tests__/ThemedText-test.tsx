import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

describe('parent describe', () => {
  describe.each`
    value | expected
    ${1} | ${"1"}
    ${2} | ${"2"}
    ${3} | ${"3"}
    ${4} | ${"4"}
  `('describe each with tag for value "$value"', () => {
    test('test inside describe tag', () => {
      debugger
    });

    it('it inside describe tag', () => {})

    test.skip('test inside describe tag skipped', () => {});

    it.skip('it inside describe tag skipped', () => {})
  })

  describe.each([1, 2, 3, 4])('describe each with array for value "%d"', (value) => {
    test('test inside describe array', () => {});

    it('it inside describe array', () => {})

    test.skip('test inside describe array skipped', () => {});

    it.skip('it inside describe array skipped', () => {})
  })
})