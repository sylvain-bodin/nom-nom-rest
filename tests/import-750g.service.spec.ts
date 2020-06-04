import fs from 'fs';
import import750gService from '../src/services/import-750g.service';

describe('Import 750g Service', () => {
  it('should read page to create a recipe', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/image_recette.jpg');
    const imageBase64 = image.toString('base64');

    // when
    const recipe = await import750gService.import('https://www.750g.com/riz-saute-au-poulet-legumes-et-amandes-r205183.htm');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Riz sauté au poulet, légumes et amandes');
    expect(recipe.url).toBe('https://www.750g.com/riz-saute-au-poulet-legumes-et-amandes-r205183.htm');
    expect(recipe.image).toBe(imageBase64);
    expect(recipe.tags).toContain('Facile');
    expect(recipe.tags).toContain('Bon marché');
    const expectedIngredients = ['250 g de riz basmati',
      '2 carottes',
      '1 oignon',
      '120 g de petits pois',
      '2 blancs de poulet',
      '4 pistils de safran',
      '4 c. à s. d\'huile d\'olive',
      '1 petit bouquet de persil',
      '100 g d\'amandes effilées et grillées',
      '0,25 c. à c. de sel ou sel fin',
      '0,25 c. à c. de poivre'];
    expect(recipe.ingredients).toStrictEqual(expectedIngredients);
  });
});
