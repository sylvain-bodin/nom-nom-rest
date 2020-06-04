import { Recipe } from '../types/recipe';
import CrawlerService from './crawler.service';

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
    const ingredients: string[] = [];
    $('.c-recipe-ingredients__list').children().each((index, ingredient) => {
      ingredients.push(this.getCleanDirectText($(ingredient)));
    });

    return {
      _id: null, name, url, image, tags, ingredients,
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
}


export default Import750gService;
