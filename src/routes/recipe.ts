import {
  NextFunction, Request, Response, Router,
} from 'express';
import Recipe from '../models/recipe';
import { logger } from '../services/log';
import importFactory from '../services/import.factory';
import ImportUtils from '../services/import-utils';
import { Ingredient } from '../types/ingredient';
import recipeService from '../services/recipe-service';


const recipeRouter = Router();

function authentifiedHandler(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.sendStatus(401);
  }
  next();
}

recipeRouter.get('/', authentifiedHandler, async (req, res) => {
  const query = {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    userId: req.user._id,
  };
  const recipes = await Recipe.find(query).lean().exec().catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  return res.send(recipes);
});

recipeRouter.post('/', authentifiedHandler, async (req, res) => {
  const data = req.body;
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  data.userId = req.user._id;
  await Recipe.create(data).catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return res.sendStatus(201);
});

recipeRouter.get('/search', authentifiedHandler, async (req, res) => {
  const range = req.query.range as string || '0-10';
  const sort = req.query.sort as string || '';
  const desc = req.query.desc as string || '';
  // @ts-ignore
  const userId = req.user?._id as string;
  const [first, last]: string[] = range.split('-');
  const skip = Number.parseInt(first, 10);
  const limit = Number.parseInt(last, 10) - skip + 1;
  let sortField: string = '';
  let sortOrder = 'asc';

  const projection = {
    name: 1, preparationTime: 1, cookingTime: 1, waitingTime: 1, tags: 1,
  };

  if (sort) {
    sortField = sort;
    sortOrder = 'asc';
  } else if (desc) {
    sortField = desc;
    sortOrder = 'desc';
  }

  const [recipes, itemCount] = await Promise.all([
    recipeService.search(userId, projection, skip, limit, sortField, sortOrder),
    Recipe.find({ userId }).countDocuments(),
  ]);
  return res.set('Content-Range', `recipes ${first}-${last}/${itemCount}`).send({
    total: itemCount, items: recipes,
  });
});

recipeRouter.get('/tags', authentifiedHandler, async (req, res) => {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  const tags = await Recipe.distinct('tags', { userId: req.user._id }).lean().exec().catch((err) => {
    logger.error(err, 'Error getting tags');
  });
  res.send(tags);
});


recipeRouter.post('/import', authentifiedHandler, async (req, res) => {
  const { url } = req.body;
  let recipe;
  try {
    recipe = await importFactory.getService(url).import(url);
  } catch (e) {
    logger.error(e);
    recipe = { name: '', url };
  }
  res.send(recipe);
});

recipeRouter.post('/ingredients/transform', authentifiedHandler, (req, res) => {
  const { text } = req.body;
  const ingredients: Ingredient[] = [];
  text.split('\n').forEach((ingredientText: string) => {
    ingredients.push(ImportUtils.parseIngredient(ingredientText));
  });
  res.send(ingredients);
});

recipeRouter.get('/:id', authentifiedHandler, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).lean().exec().catch((err) => {
    logger.error(err, `Error getting recipe ${req.params.id}`);
  });
  return res.send(recipe);
});

recipeRouter.delete('/:id', authentifiedHandler, async (req, res) => {
  await Recipe.deleteOne({ _id: req.params.id }).exec().catch((err) => {
    logger.error(err, `Error getting recipe ${req.params.id}`);
  });
  return res.sendStatus(204);
});

export default recipeRouter;
