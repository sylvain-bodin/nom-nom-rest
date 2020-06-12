import { Router } from 'express';
import { logger } from '../services/log';
import passport from '../passport';

const authRouter = Router();

authRouter.get('/facebook',
  passport.authenticate('facebook'));
authRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  // const { error, error_description, error_uri } = req.query;
  // if (error) {
  //   res.status(500).json({
  //     error,
  //     error_description,
  //     error_uri,
  //   });
  // } else {
  //   res.cookie('access-token-facebook', req.query.access_token);
  logger.info('Connected to Facebook');
  // res.redirect();
  res.end(JSON.stringify(req.user, null, 2));
  // }
});
export default authRouter;
