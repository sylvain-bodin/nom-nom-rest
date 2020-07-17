import { Recipe } from '../../types/recipe';
import CrawlerService from '../crawler.service';
import { Ingredient } from '../../types/ingredient';
import { ImportService } from './import.service';
import ImportUtils from './import-utils';


class ImportMarmitonService implements ImportService {
  // eslint-disable-next-line class-methods-use-this
  async import(url: string): Promise<Recipe> {
    const $ = await CrawlerService.getPage(url);

    // Name
    const name = $('.main-title').text();

    // Image
    const image = await ImportMarmitonService.getImage($);

    // Tags
    const tags = ImportMarmitonService.getTags($);

    // Ingredients
    const ingredients = ImportMarmitonService.getIngredients($);

    // Number of portions
    const nbPortions = ImportMarmitonService.getNbPortions($);

    // Times
    const preparationTime = ImportMarmitonService.getPreparationTime($);
    const waitingTime = ImportMarmitonService.getWaitingTime($);
    const cookingTime = ImportMarmitonService.getCookingTime($);

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
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-infos__timmings__cooking')), 10);
  }

  private static getWaitingTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-steps-info time:not([itemprop])')), 10);
  }

  private static getPreparationTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('.recipe-infos__timmings__preparation')), 10);
  }

  private static getNbPortions($: CheerioStatic) {
    let nbIngredientText = $('.recipe-infos__quantity__value').text();
    const found = nbIngredientText.match(/([0-9]+)/);
    return Number.parseInt(found ? found[0] : '', 10);
  }

  private static getIngredients($: CheerioStatic) {
    const ingredients: Ingredient[] = [];
    $('.recipe-ingredients__list__item').each((index, ingredient) => {
      const ingredientText = ImportUtils.getCleanDirectText($(ingredient));
      ingredients.push(ImportUtils.parseIngredient(ingredientText));
    });
    return ingredients;
  }

  private static getTags($: CheerioStatic) {
    const tags: string[] = [];
    const difficulty = ImportUtils.getCleanDirectText($('.recipe-infos__level .recipe-infos__item-title '));
    tags.push(difficulty);
    const price = ImportUtils.getCleanDirectText($('.recipe-infos__budget .recipe-infos__item-title'));
    tags.push(price)
    $('.mrtn-tags-list .mrtn-tag').each((index, tag)=> {
      const tagText = ImportUtils.getCleanDirectText($(tag))
      tags.push(tagText);
    });
    return tags;
  }

  private static async getImage($: CheerioStatic) {
    let image;
    const $img = $('#recipe-media-viewer-main-picture');
    let imageUrl = $img.attr('data-src');
    // If the picture isn't visible, we get its URL from another attribute
    if (!imageUrl) {
      imageUrl = $('.af-pin-it-wrapper .img').attr('src');
    }
    if (imageUrl) {
      image = await CrawlerService.getImage(imageUrl);
      image = `data:image/jpeg;base64,${image}`;
    }
    return image;
  }
}

const importMarmitonService = new ImportMarmitonService();
export default importMarmitonService;
