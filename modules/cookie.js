import passport from "passport";
import session from "express-session";
import dotenv from 'dotenv';
dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

const setupSession = (app) => {
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
};

export default setupSession;