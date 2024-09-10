import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
import setupSession from "./modules/cookie.js";
import routes from "./modules/routes.js";

import { setupPassport, authRouter } from './modules/auth.js';
import adminRouter from './modules/admin.js';


const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupSession(app);
setupPassport();

app.use((req, res, next) => {
  console.log('User in all routes:', req.user); // Should print for all routes
  next();
});
const streamKey = process.env.STREAM_KEY;

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

app.use("/", routes);
app.use(authRouter);
app.use('/admin', adminRouter);





app.listen(port, () => {
    console.log(`App running on ${port}`);
});