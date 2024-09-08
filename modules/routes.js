import express from 'express';


const router = express.Router();

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



export default router;