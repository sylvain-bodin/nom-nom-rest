import {Ingredient} from '../types/ingredient';

class ImportUtils {
  static getCleanDirectText(element: Cheerio): string {
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
  static parseIngredient(ingredientText: string): Ingredient {
    const regex = /^([0-9,./]+)?\s*((g|c. à c.|c. à s.|cl)(\s*(de|d')\s*))?(.*)$/gmiu;
    const found = [...ingredientText.matchAll(regex)][0];
    const [, textValue, , unit, , , name] = found;
    const value = textValue ? Number.parseFloat((textValue as string).replace(',', '.')) : undefined;
    return {value, unit, name};
  }
}

export default ImportUtils;
