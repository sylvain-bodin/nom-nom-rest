import {
  NextFunction, Request, Response, Router,
} from 'express';
import Recipe from '../models/recipe';
import { logger } from '../services/log';
import importFactory from '../services/imports/import.factory';
import ImportUtils from '../services/imports/import-utils';
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
  const projection = {
    name: 1, preparationTime: 1, cookingTime: 1, waitingTime: 1, tags: 1,
  };
  const limit = req.query.limit as string || null;
  const offset = req.query.offset as string || null;
  const sort = req.query.sort as string || null;
  const fields = req.query.fields as string || null;
  // @ts-ignore
  const userId = req.user?._id as string;

  let select = {};
  if (fields) {
    fields.split(',').forEach((item:string) => {
      // @ts-ignore
      select[item] = 1;
    });
  } else {
    select = { ...projection };
  }
  const sorting = {};
  if (sort) {
    sort.split(',').forEach((item) => {
      const sortField = item.slice(1);
      // @ts-ignore
      sorting[sortField] = Number.parseInt(item.slice(0, 1) + 1, 10);
    });
  }
  let numberLimit = 50;
  if (limit) {
    numberLimit = Number.parseInt(limit, 10);
  }
  let skip = 0;
  if (offset) {
    skip = Number.parseInt(offset, 10);
  }


  const [recipes, itemCount] = await Promise.all([
    recipeService.search(userId, select, skip, numberLimit, sorting),
    Recipe.find({ userId }).countDocuments(),
  ]);
  return res.set('Content-Range', `recipes ${skip}-${skip + numberLimit}/${itemCount}`).send({
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
