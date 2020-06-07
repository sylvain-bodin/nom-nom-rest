import { Recipe } from '../types/recipe';
import CrawlerService from './crawler.service';
import { Ingredient } from '../types/ingredient';

class Import750gService {
  static async import(url: string): Promise<Recipe> {
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
    const difficulty = this.getCleanDirectText($('.c-recipe-summary__rating[title="Difficulté"]'));
    tags.push(difficulty);
    const price = this.getCleanDirectText($('.c-recipe-summary__rating[title="Coût"]'));
    tags.push(price);

    // Ingredients
    const ingredients: Ingredient[] = [];
    $('.c-recipe-ingredients__list').children().each((index, ingredient) => {
      const ingredientText = this.getCleanDirectText($(ingredient));
      ingredients.push(this.parseIngredient(ingredientText));
    });

    // Number of portions
    const nbPortions = Number.parseInt($('.c-ingredient-variator-label').text(), 10);

    return {
      _id: null, name, url, image, tags, ingredients, nbPortions,
    };
  }

  private static getCleanDirectText(element: Cheerio): string {
    return element.clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();
  }

  /**
   * Convert a text of ingredient to an Ingedient object.
   * It parse the text to find the number of unit, the unit and the name of the ingradient
   * @param ingredientText
   */
  private static parseIngredient(ingredientText: string): Ingredient {
    const regex = /^([0-9,./]+)\s*((g|c. à c.|c. à s.)(\s*(de|d')\s*))?(.*)$/gmiu;
    const found = [...ingredientText.matchAll(regex)][0];
    const [, textValue, , unit, , , name] = found;
    const value = Number.parseFloat((textValue as string).replace(',', '.'));
    return { value, unit, name };
  }
}


export default Import750gService;
