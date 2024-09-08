import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
import routes from "./modules/routes.js";
import setupSession from "./modules/cookie.js";
import { setupPassport, authRouter } from './modules/auth.js';


const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static("public"));

setupSession(app);
setupPassport();

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

app.use("/", routes);
app.use(authRouter);



app.listen(port, () => {
    console.log(`App running on ${port}`);
});