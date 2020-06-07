import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import recipeRouter from './routes/recipe';
import { connectDb } from './models';
import { expressLogger, logger } from './services/log';


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(expressLogger);

app.use('/recipes', recipeRouter);

connectDb().then(async () => {
  app.listen(PORT, () => {
    logger.info('Server running on port %d', PORT);
  });
});
