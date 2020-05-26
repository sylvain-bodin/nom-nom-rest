import { connect } from 'mongoose';
import Recipe from '../models/recipe';

const connectDb = () => connect(process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true });

const models = { Recipe };

export { connectDb };
export default models;
