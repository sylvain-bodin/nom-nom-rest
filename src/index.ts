import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import recipeRouter from './routes/recipe';
import { connectDb } from './routes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/recipes', recipeRouter);

connectDb().then(async () => {
  app.listen(3000, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
});
