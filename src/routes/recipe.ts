import { Router } from 'express';

const recipeRouter = Router();

recipeRouter.get('/', (req, res) => res.send(''));

export default recipeRouter;
