import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import config from '../config/index.js';

const secretOrKey = config.JWT.SECRET;
const opts = {
  secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) return done(null, false);

      return done(null, user.getUserInfo());
    } catch (error) {
      return done(error, false);
    }
  })
);

export const verifyUser = passport.authenticate('jwt', { session: false });
