import passport from "passport";
import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.SESS_SECRET || 'default-secret',
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