import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes/routes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/recipes', routes.recipe);

export default app;
