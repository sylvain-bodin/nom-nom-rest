import fs from 'fs';
import import750gService from '../../../src/services/imports/import-750g.service';

describe('Import 750g Service', () => {
  it('should read page to create a recipe', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/photo_riz_poulet.jpg');
    const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

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
    const expectedIngredients = [{ value: 250, unit: 'g', name: 'riz basmati' },
      { value: 2, unit: undefined, name: 'carottes' },
      { value: 1, unit: undefined, name: 'oignon' },
      { value: 120, unit: 'g', name: 'petits pois' },
      { value: 2, unit: undefined, name: 'blancs de poulet' },
      { value: 4, unit: undefined, name: 'pistils de safran' },
      { value: 4, unit: 'c. à s.', name: 'huile d\'olive' },
      { value: 1, unit: undefined, name: 'petit bouquet de persil' },
      { value: 100, unit: 'g', name: 'amandes effilées et grillées' },
      { value: 0.25, unit: 'c. à c.', name: 'sel ou sel fin' },
      { value: 0.25, unit: 'c. à c.', name: 'poivre' }];
    expect(recipe.ingredients).toStrictEqual(expectedIngredients);
    expect(recipe.nbPortions).toBe(4);
    expect(recipe.preparationTime).toBe(30);
    expect(recipe.cookingTime).toBe(26);
  });

  it('should get the waiting time', async () => {
    // given

    // when
    const recipe = await import750gService.import('https://www.750g.com/salade-mexicaine-au-poulet-r205739.htm');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Salade mexicaine au poulet');
    expect(recipe.url).toBe('https://www.750g.com/salade-mexicaine-au-poulet-r205739.htm');
    expect(recipe.nbPortions).toBe(4);
    expect(recipe.preparationTime).toBe(30);
    expect(recipe.cookingTime).toBe(7);
    expect(recipe.waitingTime).toBe(30);
  });

  it('should get the image if there is a video', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/photo_nuggets.jpg');
    const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

    // when
    const recipe = await import750gService.import('https://www.750g.com/nuggets-fait-maison-r205224.htm');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Nuggets fait-maison');
    expect(recipe.url).toBe('https://www.750g.com/nuggets-fait-maison-r205224.htm');
    expect(recipe.image).toBe(imageBase64);
  });

  it('should get the number of portion if there is no cursor', async () => {
    // given

    // when
    const recipe = await import750gService.import('https://www.750g.com/nuggets-fait-maison-r205224.htm');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Nuggets fait-maison');
    expect(recipe.nbPortions).toBe(12);
  });
});
