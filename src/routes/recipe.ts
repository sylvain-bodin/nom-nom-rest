import { Router } from 'express';
import Recipe from '../models/recipe';
import { logger } from '../services/log';

const recipeRouter = Router();

recipeRouter.get('/', async (req, res) => {
  const recipes = await Recipe.find().catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  return res.send(recipes);
});

recipeRouter.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).catch((err) => {
    logger.error(err, `Error getting recipe ${req.params.id}`);
  });
  return res.send(recipe);
});

recipeRouter.post('/', async (req, res) => {
  const recipe = await Recipe.create(req.body).catch((err) => {
    logger.error(err, 'Error getting recipes');
  });
  return res.send(recipe);
});
export default recipeRouter;
