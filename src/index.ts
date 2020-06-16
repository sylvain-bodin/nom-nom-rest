import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { connection } from 'mongoose';
import recipeRouter from './routes/recipe';
import connectDb from './models';
import { expressLogger, logger } from './services/log';
import authRouter from './routes/auth';
import passport from './passport';

const PORT = process.env.PORT || 3000;
const BASE_APP = process.env.BASE_APP || '';
const app = express();
const MongoStore = connectMongo(session);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: BASE_APP }));
app.use(expressLogger);
app.use(session({
  secret: 'nom-nom-secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: connection }),
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
