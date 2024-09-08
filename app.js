import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import routes from "./modules/routes.js";


const app = express();
const port = process.env.SERVER_PORT;

app.set('view engine', 'ejs');
// Set the directory for your views
app.set('views', './views');

app.use(express.static("public"));

app.use("/", routes);


app.listen(port, () => {
    console.log(`App running on ${port}`);
});