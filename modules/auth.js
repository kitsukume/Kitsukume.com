import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import express from 'express';
import db from './db.js';

const saltRounds = 10;

const setupPassport = () => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          return done(null, false);
        });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });
};

const router = express.Router();

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}));

router.post("/register", async (req, res) => {
  const { username: email, password } = req.body;
  
  if (!password) {
    return res.status(400).send("Password is required");
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.send("Email already exists. Try logging in.");
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, hash]
      );
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) return res.status(500).send("Login failed");
        res.redirect("/dashboard");
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

export { setupPassport, router as authRouter };