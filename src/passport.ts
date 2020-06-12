// Configuration des connexions via Passport
import passport from 'passport';
import { Strategy } from 'passport-facebook';
import User from './models/users';

const { FB_APP_ID = '', FB_APP_SECRET = '' } = process.env;

passport.use(new Strategy({
  clientID: FB_APP_ID,
  clientSecret: FB_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],

}, (accessToken, refreshToken, profile, done) => {
  if (profile.emails && profile.emails.length > 0) {
    const searchQuery = {
      email: profile.emails[0].value,
    };

    const updates = {
      email: profile.emails[0].value,
      name: profile.displayName,
      providers: [{ name: profile.provider, id: profile.id }],
    };
    User.findOneAndUpdate(searchQuery, updates, { upsert: true }, (err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }
  return done('No email');
}));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

export default passport;
