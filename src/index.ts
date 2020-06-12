import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import recipeRouter from './routes/recipe';
import connectDb from './models';
import { expressLogger, logger } from './services/log';
import authRouter from './routes/auth';
import passport from './passport';

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(expressLogger);
app.use(session({
  secret: 'nom-nom-secret', resave: false, saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());

// Déclaration des routes
app.use('/recipes', recipeRouter);
app.use('/auth', authRouter);


connectDb().then(async () => {
  app.listen(PORT, () => {
    logger.info('Server running on port %d', PORT);
  });
});
