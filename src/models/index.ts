import { connect } from 'mongoose';
import { logger } from '../services/log';

const connectDb = () => connect(process.env.DATABASE_URL as
    string,
{ useNewUrlParser: true, useUnifiedTopology: true }).catch((error) => {
  logger.error(error, 'Error while connecting MongoDB');
});

export default connectDb;
