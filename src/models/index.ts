import { connect } from 'mongoose';
import Recipe from './recipe';
import { logger } from '../services/log';

const connectDb = () => connect(process.env.DATABASE_URL as
    string,
{ useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  logger.error(error, 'Error while connecting MongoDB');
});
const models = { Recipe };

export { connectDb };
export default models;
