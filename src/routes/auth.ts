import { Router } from 'express';
import passport from '../passport';

const authRouter = Router();
const baseApp = process.env.BASE_APP || '';

authRouter.get('/facebook', passport.authenticate('facebook'));
authRouter.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: `${baseApp}/`,
  failureRedirect: `${baseApp}/login`,
}));

authRouter.get('/twitter',
  passport.authenticate('twitter'));

authRouter.get('/twitter/callback', passport.authenticate('twitter', {
  successRedirect: `${baseApp}/`,
  failureRedirect: `${baseApp}/login`,
}));

authRouter.get('/google',
  passport.authenticate('google'));

authRouter.get('/google/callback', passport.authenticate('google', {
  successRedirect: `${baseApp}/`,
  failureRedirect: `${baseApp}/login`,
}));

authRouter.get('/me', (req, res) => {
  res.send(req.user);
});
export default authRouter;
