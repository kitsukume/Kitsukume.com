import passport from 'passport';
import express from 'express';
import { setupPassport, authRouter } from './auth.js';
import adminRouter from './admin.js';

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

router.get("/about", (req, res) => {
    res.render("about.ejs");
});

/* router.use('/admin', adminRouter); */

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true });
  });

  router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        res.render('user/dashboard.ejs', { user });
      } catch (err) {
        res.status(500).send("Server error");
      }
    } else {
      res.redirect('/home');
    }
  });

/*   router.get('/admin', (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        const isAdmin = user.roles && user.roles.includes('admin');
        res.render('admin/admin-dashboard.ejs', { user, isAdmin });
      } catch (err) {
        res.status(500).send("Server error");
      }
    } else {
      res.redirect('/home');
    }
  }); */
  

  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { 
        return next(err); 
      }
      res.redirect('/home');
    });
  });

export default router;