import ImportUtils from '../src/services/import-utils';

describe('Import utils', () => {
  describe('parseIngredient', () => {
    const ingredientsTest = [
      {
        text: '4 blancs de poulet',
        expected: {
          name: 'blancs de poulet',
          unit: undefined,
          value: 4,
        },
      },
      {
        text: '100 g de corn flakes',
        expected: {
          name: 'corn flakes',
          unit: 'g',
          value: 100,
        },
      },
      {
        text: '0,5 c. à c. d\'epices mexicaines',
        expected: {
          name: 'epices mexicaines',
          unit: 'c. à c.',
          value: 0.5,
        },
      },
      {
        text: '4 c. à s. d\'huile d\'olive',
        expected: {
          name: 'huile d\'olive',
          unit: 'c. à s.',
          value: 4,
        },
      },
      {
        text: 'Huile d\'olive',
        expected: {
          name: 'Huile d\'olive',
          unit: undefined,
          value: undefined,
        },
      },
      {
        text: '6 cl de jus de citron vert',
        expected: {
          name: 'jus de citron vert',
          unit: 'cl',
          value: 6,
        },
      }, {
        text: '100g de chapelure',
        expected: {
          name: 'chapelure',
          unit: 'g',
          value: 100,
        },
      },

    ];
    ingredientsTest.forEach((ingredientTest) => {
      it(`should parse ${ingredientTest.text}`, () => {
        // when
        const ingredient = ImportUtils.parseIngredient(ingredientTest.text);

        // then
        expect(ingredient).toEqual(ingredientTest.expected);
      });
    });
  });
});
