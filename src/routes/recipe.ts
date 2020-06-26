import {NextFunction, Request, Response, Router} from 'express';
import Recipe from '../models/recipe';
import {logger} from '../services/log';
import importFactory from '../services/import.factory';
import ImportUtils from '../services/import-utils';
import {Ingredient} from '../types/ingredient';

const recipeRouter = Router();

function authentifiedHandler(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.sendStatus(401);
  }
  next();
}

recipeRouter.get('/', authentifiedHandler, async (req, res) => {
  const searchQuery = {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    userId: req.user._id,
  };
  const recipes = await Recipe.find(searchQuery).catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  return res.send(recipes);
});

recipeRouter.get('/:id', authentifiedHandler, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).catch((err) => {
    logger.error(err, `Error getting recipe ${req.params.id}`);
  });
  return res.send(recipe);
});

recipeRouter.post('/import', authentifiedHandler, async (req, res) => {
  const {url} = req.body;
  let recipe;
  try {
    recipe = await importFactory.getService(url).import(url);
  } catch (e) {
    logger.error(e);
    recipe = {name: '', url};
  }
  res.send(recipe);
});

recipeRouter.post('/', authentifiedHandler, async (req, res) => {
  const data = req.body;
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  data.userId = req.user._id;
  const recipe = await Recipe.create(data).catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  return res.send(recipe);
});

recipeRouter.post('/ingredients/transform', authentifiedHandler, async (req, res) => {
  const {text} = req.body;
  const ingredients: Ingredient[] = [];
  text.split('\n').forEach((ingredientText: string) => {
    ingredients.push(ImportUtils.parseIngredient(ingredientText));
  });
  res.send(ingredients);
});
export default recipeRouter;
