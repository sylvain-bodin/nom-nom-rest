import passport, { Profile } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from './models/users';

const {
  FB_APP_ID = '',
  FB_APP_SECRET = '',
  BASE_CALLBACK = '',
  TWITTER_CUSTOMER_KEY = '',
  TWITTER_CUSTOMER_SECRET = '',
  GOOGLE_CLIENT_ID = '',
  GOOGLE_CLIENT_SECRET = '',
} = process.env;

// eslint-disable-next-line consistent-return
function verify(token: string,
  tokenSecret: string,
  profile: Profile,
  done: (error: any, user?: any, info?: any) => void) {
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
  } else {
    return done('No email');
  }
}

passport.use(new FacebookStrategy({
  clientID: FB_APP_ID,
  clientSecret: FB_APP_SECRET,
  callbackURL: `${BASE_CALLBACK}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'email'],
}, verify));

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CUSTOMER_KEY,
  consumerSecret: TWITTER_CUSTOMER_SECRET,
  callbackURL: `${BASE_CALLBACK}/auth/twitter/callback`,
  includeEmail: true,
  includeEntities: false,
  includeStatus: false,
}, verify));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_CALLBACK}/auth/google/callback`,
  scope: ['openid', 'profile', 'email'],
}, verify));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

export default passport;
