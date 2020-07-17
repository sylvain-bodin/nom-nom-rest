import { Recipe } from '../../types/recipe';
import CrawlerService from '../crawler.service';
import { Ingredient } from '../../types/ingredient';
import { ImportService } from './import.service';
import ImportUtils from './import-utils';


class ImportCuisineAzService implements ImportService {
  // eslint-disable-next-line class-methods-use-this
  async import(url: string): Promise<Recipe> {
    const $ = await CrawlerService.getPage(url);

    // Name
    const name = $('.recipe-title').text();

    // Image
    const image = await ImportCuisineAzService.getImage($);

    // Tags
    const tags = ImportCuisineAzService.getTags($);

    // Ingredients
    const ingredients = ImportCuisineAzService.getIngredients($);

    // Number of portions
    const nbPortions = ImportCuisineAzService.getNbPortions($);

    // Times
    const preparationTime = ImportCuisineAzService.getPreparationTime($);
    const waitingTime = ImportCuisineAzService.getWaitingTime($);
    const cookingTime = ImportCuisineAzService.getCookingTime($);

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
    return Number.parseInt(ImportUtils.getCleanDirectText($('#ContentPlaceHolder_LblRecetteTempsCuisson')), 10);
  }

  private static getWaitingTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('#ContentPlaceHolder_LblRecetteTempsRepos')), 10);
  }

  private static getPreparationTime($: CheerioStatic) {
    return Number.parseInt(ImportUtils.getCleanDirectText($('#ContentPlaceHolder_LblRecetteTempsPrepa')), 10);
  }

  private static getNbPortions($: CheerioStatic) {
    let nbIngredientText = $('#ContentPlaceHolder_LblRecetteNombre').text();
    const found = nbIngredientText.match(/([0-9]+)/);
    return Number.parseInt(found ? found[0] : '', 10);
  }

  private static getIngredients($: CheerioStatic) {
    const ingredients: Ingredient[] = [];
    $('.ingredients li').each((index, ingredient) => {
      const ingredientText = ImportUtils.getCleanDirectText($(ingredient));
      ingredients.push(ImportUtils.parseIngredient(ingredientText));
    });
    return ingredients;
  }

  private static getTags($: CheerioStatic) {
    const tags: string[] = [];
    const difficulty = ImportUtils.getCleanDirectText($('#ContentPlaceHolder_pnlRecetteDifficulte'));
    tags.push(difficulty);
    return tags;
  }

  private static async getImage($: CheerioStatic) {
    let image;
    const $img = $('.recipe_img > img');
    let imageUrl = $img.attr('data-src');
    if (imageUrl) {
      image = await CrawlerService.getImage(imageUrl);
      image = `data:image/jpeg;base64,${image}`;
    }
    return image;
  }
}

const importCuisineAZService = new ImportCuisineAzService();
export default importCuisineAZService;
