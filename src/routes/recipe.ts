import { Router } from 'express';
import Recipe from '../models/recipe';

const recipeRouter = Router();

recipeRouter.get('/', async (req, res) => {
  const recipes = await Recipe.find();
  return res.send(recipes);
});

recipeRouter.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  return res.send(recipe);
});

recipeRouter.post('/', async (req, res) => {
  const recipe = await Recipe.create(req.body);
  return res.send(recipe);
});
export default recipeRouter;
