import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import cloudinary from './config/cloudinary';
import session from 'express-session';
import connectDB from "./config/mongo";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";


import hostRoute from "./interfaces/routes/hostRoute";
import guestRoute from "./interfaces/routes/guestRoute";
import adminRoute from "./interfaces/routes/adminRoute";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));


app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));


app.use(session({
  secret: 'your-secret',
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use("/", guestRoute);
app.use("/host", hostRoute);
app.use("/admin", adminRoute);

const port = 5000;

connectDB()

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running").status(200)
});

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
});









