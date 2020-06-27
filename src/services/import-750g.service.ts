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
    const name = $('.c-article__title').text();

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
    return Number.parseInt(ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Temps de cuisson"]')), 10);
  }

  private static getWaitingTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Temps d\'attente"]')), 10);
  }

  private static getPreparationTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Temps de préparation"]')), 10);
  }

  private static getNbPortions($: CheerioStatic) {
    let nbIngredientText = $('.c-ingredient-variator-label').text();
    if (!nbIngredientText) {
      nbIngredientText = $('.c-recipe-ingredients').siblings('.u-title-section').text();
    }
    const found = nbIngredientText.match(/([0-9]+)/);
    return Number.parseInt(found ? found[0] : '', 10);
  }

  private static getIngredients($: CheerioStatic) {
    const ingredients: Ingredient[] = [];
    $('.c-recipe-ingredients__list').children().each((index, ingredient) => {
      const ingredientText = ImportUtils.getCleanDirectText($(ingredient));
      ingredients.push(ImportUtils.parseIngredient(ingredientText));
    });
    return ingredients;
  }

  private static getTags($: CheerioStatic) {
    const tags: string[] = [];
    const difficulty = ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Difficulté"]'));
    tags.push(difficulty);
    const price = ImportUtils.getCleanDirectText($('.c-recipe-summary__rating[title="Coût"]'));
    tags.push(price);
    return tags;
  }

  private static async getImage($: CheerioStatic) {
    let image;
    const $img = $('img.photo');
    let imageUrl = $img.attr('src');
    // If the picture isn't visible, we get its URL from another attribute
    if (!imageUrl) {
      imageUrl = $img.attr('data-src');
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
