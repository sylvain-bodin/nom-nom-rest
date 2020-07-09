import { Recipe } from '../types/recipe';
import CrawlerService from './crawler.service';
import { Ingredient } from '../types/ingredient';
import { ImportService } from './import.service';
import ImportUtils from './import-utils';


class Import750gService implements ImportService {
  // eslint-disable-next-line class-methods-use-this
  async import(url: string): Promise<Recipe> {
    const $ = await CrawlerService.getPage(url);

    // Name
    const name = $('.recipe-title').text();

    // Image
    const image = await Import750gService.getImage($);

    // Tags
    const tags = Import750gService.getTags($);

    // Ingredients
    const ingredients = Import750gService.getIngredients($);

    // Number of portions
    const nbPortions = Import750gService.getNbPortions($);

    // Times
    const preparationTime = Import750gService.getPreparationTime($);
    const waitingTime = Import750gService.getWaitingTime($);
    const cookingTime = Import750gService.getCookingTime($);

    return {
      _id: null,
      name,
      url,
      image,
      tags,
      ingredients,
      nbPortions,
      preparationTime,
      waitingTime,
      cookingTime,
    };
  }

  private static getCookingTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-steps-info time[itemprop="cookTime"]')), 10);
  }

  private static getWaitingTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-steps-info time:not([itemprop])')), 10);
  }

  private static getPreparationTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-steps-info time[itemprop="prepTime"]')), 10);
  }

  private static getNbPortions($: CheerioStatic) {
    let nbIngredientText = $('.ingredient-variator-label').text();
    if (!nbIngredientText) {
      nbIngredientText = $('.recipe-ingredients > header').text();
    }
    const found = nbIngredientText.match(/([0-9]+)/);
    return Number.parseInt(found ? found[0] : '', 10);
  }

  private static getIngredients($: CheerioStatic) {
    const ingredients: Ingredient[] = [];
    $('.recipe-ingredients .recipe-ingredients-item-label').each((index, ingredient) => {
      const ingredientText = ImportUtils.getCleanDirectText($(ingredient));
      ingredients.push(ImportUtils.parseIngredient(ingredientText));
    });
    return ingredients;
  }

  private static getTags($: CheerioStatic) {
    const tags: string[] = [];
    const difficulty = ImportUtils.getCleanDirectText($('.recipe-info li:nth-child(2)'));
    tags.push(difficulty);
    const price = ImportUtils.getCleanDirectText($('.recipe-info li:nth-child(3)'));
    tags.push(price);
    return tags;
  }

  private static async getImage($: CheerioStatic) {
    let image;
    const $img = $('.recipe-cover > img');
    let imageUrl = $img.attr('src');
    // If the picture isn't visible, we get its URL from another attribute
    if (!imageUrl) {
      imageUrl = $('.recipe-cover .js-jwPlayer-source').first().attr('data-image');
    }
    if (imageUrl) {
      image = await CrawlerService.getImage(imageUrl);
      image = `data:image/jpeg;base64,${image}`;
    }
    return image;
  }
}

const import750gService = new Import750gService();
export default import750gService;
