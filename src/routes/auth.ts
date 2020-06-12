import { Router } from 'express';
import passport from '../passport';

const authRouter = Router();
const baseApp = process.env.BASE_APP || '';

authRouter.get('/facebook',
  passport.authenticate('facebook'));

authRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${baseApp}/login` }), (req, res) => {
  res.redirect(`${baseApp}/`);
});

authRouter.get('/me', (req, res) => {
  res.send(req.user);
});
export default authRouter;
