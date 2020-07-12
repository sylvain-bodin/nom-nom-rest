import Recipe from '../models/recipe';

class RecipeService {
  // eslint-disable-next-line class-methods-use-this
  search(userId: string,
    select: Object,
    skip: number,
    limit: number,
    sortField: string,
    sortOrder: string) {
    const sort: Object = {};
    if (sortField) {
      // @ts-ignore
      sort[sortField] = sortOrder;
    }
    const query = {
      userId,
    };
    return Recipe.find(query)
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();
  }
}

const recipeService = new RecipeService();
export default recipeService;
