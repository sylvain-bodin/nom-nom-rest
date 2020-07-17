import fs from 'fs';
import importMarmitonService from '../../src/services/imports/import-marmiton.service';

describe('Import Marmiton Service', () => {
	it('should read page to create a recipe', async () => {
		// given
		const image = fs.readFileSync('./tests/resources/photo_courgettes_chorizo.jpg');
		const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

		// when
		const recipe = await importMarmitonService.import('https://www.marmiton.org/recettes/recette_courgettes-au-chorizo_53246.aspx');

		// then
		expect(recipe).not.toBeNull();
		expect(recipe).toBeDefined();
		// eslint-disable-next-line no-underscore-dangle
		expect(recipe._id).toBeNull();
		expect(recipe.name).toBe('Courgettes au chorizo');
		expect(recipe.url).toBe('https://www.marmiton.org/recettes/recette_courgettes-au-chorizo_53246.aspx');
		expect(recipe.image).toBe(imageBase64);
		expect(recipe.tags).toContain('Plat principal');
		expect(recipe.tags).toContain('Sans gluten');
		expect(recipe.tags).toContain('Sans four');
		expect(recipe.tags).toContain('Très facile');
		expect(recipe.tags).toContain('Bon marché');
		const expectedIngredients = [{value: 2, unit: 'g', name: 'courgettes assez grosses, sinon 3 à 4 courgettesti'},
			{value: 1, unit: undefined, name: 'chorizo plus ou moins fort selon le goût'}];
		expect(recipe.ingredients).toStrictEqual(expectedIngredients);
		expect(recipe.nbPortions).toBe(5);
		expect(recipe.preparationTime).toBe(5);
		expect(recipe.cookingTime).toBe(20);
	});

	xit('should get the waiting time', async () => {
		// given

		// when
		const recipe = await importMarmitonService.import('https://www.750g.com/salade-mexicaine-au-poulet-r205739.htm');

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
		const image = fs.readFileSync('./tests/resources/photo_tarte_courgettes.jpg');
		const imageBase64 = `data:image/jpeg;base64,${image.toString('base64')}`;

		// when
		const recipe = await importMarmitonService.import('https://www.marmiton.org/recettes/recette_tarte-tourbillon-chevre-courgette-miel_344471.aspx');

		// then
		expect(recipe).not.toBeNull();
		expect(recipe).toBeDefined();
		// eslint-disable-next-line no-underscore-dangle
		expect(recipe._id).toBeNull();
		expect(recipe.name).toBe('Tarte tourbillon chèvre courgette miel');
		expect(recipe.url).toBe('https://www.marmiton.org/recettes/recette_tarte-tourbillon-chevre-courgette-miel_344471.aspx');
		expect(recipe.image).toBe(imageBase64);
	});
});
