import { Recipe } from '../types/recipe';
import CrawlerService from './crawler.service';
import { Ingredient } from '../types/ingredient';
import { ImportService } from './import.service';
import ImportUtils from './import-utils';

class Import750gService implements ImportService {
  async import(url: string): Promise<Recipe> {
    const $ = await CrawlerService.getPage(url);

    // Name
    const name = $('.c-article__title').text();

    // Image
    let image;
    const imageUrl = $('img.photo').attr('src');
    if (imageUrl) {
      image = await CrawlerService.getImage(imageUrl);
    }

    // Tags
    const tags: string[] = [];
    const difficulty = ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Difficulté"]'));
    tags.push(difficulty);
    const price = ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Coût"]'));
    tags.push(price);

    // Ingredients
    const ingredients: Ingredient[] = [];
    $('.c-recipe-ingredients__list').children().each((index, ingredient) => {
      const ingredientText = ImportUtils.getCleanDirectText($(ingredient));
      ingredients.push(ImportUtils.parseIngredient(ingredientText));
    });

    // Number of portions
    const nbPortions = Number.parseInt($('.c-ingredient-variator-label').text(), 10);

    // Times
    const preparationTime = Number.parseInt(ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Temps de préparation"]')), 10);
    const cookingTime = Number.parseInt(ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Temps de cuisson"]')), 10);

    return {
      _id: null, name, url, image, tags, ingredients, nbPortions, preparationTime, cookingTime,
    };
  }
}

const import750gService = new Import750gService();
export default import750gService;
