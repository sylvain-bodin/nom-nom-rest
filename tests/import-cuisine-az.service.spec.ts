import fs from 'fs';
import importCuisineAZService from '../src/services/imports/import-cuisine-az.service';

describe('Import CuisineAZ Service', () => {
  it('should read page to create a recipe', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/photo_cannelloni.jpg');
    const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

    // when
    const recipe = await importCuisineAZService.import('https://www.cuisineaz.com/recettes/cannelloni-au-chevre-et-aux-epinards-65332.aspx');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Cannelloni au chèvre et aux épinards');
    expect(recipe.url).toBe('https://www.cuisineaz.com/recettes/cannelloni-au-chevre-et-aux-epinards-65332.aspx');
    expect(recipe.image).toBe(imageBase64);
    expect(recipe.tags).toContain('Facile');
    const expectedIngredients = [{ value: 1, unit: undefined, name: 'boîte de cannellonis' },
      { value: 500, unit: 'g', name: 'épinards hachés' },
      { value: 2, unit: undefined, name: 'pots de sauce tomate au basilic' },
      { value: 1, unit: undefined, name: 'petite brousse de chèvre d\'environ 200 g' },
      { value: 1, unit: undefined, name: 'jaune d’œuf extra frais' },
      { value: 50, unit: 'g', name: 'gruyère râpé' },
      { value: 50, unit: 'g', name: 'parmesan râpé' },
      { value: undefined, unit: undefined, name: 'sel, poivre au goût' }];
    expect(recipe.ingredients).toStrictEqual(expectedIngredients);
    expect(recipe.nbPortions).toBe(6);
    expect(recipe.preparationTime).toBe(30);
    expect(recipe.cookingTime).toBe(30);
  });

  it('should get the waiting time', async () => {
    // given

    // when
    const recipe = await importCuisineAZService.import('https://www.cuisineaz.com/recettes/pate-a-crepes-simple-et-rapide-65496.aspx');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Pâte à crêpes simple et rapide');
    expect(recipe.url).toBe('https://www.cuisineaz.com/recettes/pate-a-crepes-simple-et-rapide-65496.aspx');
    expect(recipe.nbPortions).toBe(4);
    expect(recipe.preparationTime).toBe(15);
    expect(recipe.cookingTime).toBe(20);
    expect(recipe.waitingTime).toBe(1);
  });

  it('should get the image if there is a video', async () => {
    // given
    const image = fs.readFileSync('./tests/resources/photo_gratin_courgettes.jpg');
    const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

    // when
    const recipe = await importCuisineAZService.import('https://www.cuisineaz.com/recettes/gratin-de-courgettes-simple-49574.aspx');

    // then
    expect(recipe).not.toBeNull();
    expect(recipe).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(recipe._id).toBeNull();
    expect(recipe.name).toBe('Gratin de courgettes simple');
    expect(recipe.url).toBe('https://www.cuisineaz.com/recettes/gratin-de-courgettes-simple-49574.aspx');
    expect(recipe.image).toBe(imageBase64);
  });

});
