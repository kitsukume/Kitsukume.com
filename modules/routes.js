import passport from 'passport';
import express from 'express';
import { setupPassport, authRouter } from './auth.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.render("link.ejs");
});

router.get("/links", (req, res) => {
    res.render("link.ejs");
});

router.get("/home", (req, res) => {
    res.render("home.ejs");
});

router.get("/projects", (req, res) => {
    res.render("projects.ejs");
});

router.get("/home", (req, res) => {
    res.render("home.ejs");
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true });
  });

router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('user/dashboard.ejs');
    } else {
        res.redirect('/home');
    }
  });
  

  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { 
        return next(err); 
      }
      res.redirect('/home');
    });
  });

export default router;