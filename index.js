require("dotenv").config();

const express=require("express");
const app=express();
const { connectMongoDb } = require("./connection");
const staticRoutes = require("./routes/staticRouter");
const userRoutes = require("./routes/user");
const urlRoutes = require("./routes/url");
const path = require("path");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { authenticateUser } = require("./middlewares/auth");
const mongoURI=process.env.MONGODB_URI;
connectMongoDb(mongoURI);
// Set up session middleware
app.use(session({
    secret: 'heisagoodboy', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI  }), // Use your MongoDB connection string here
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session expires in 1 day (adjust as needed)
}));

app.set('view engine',"ejs");
app.set('views',path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const PORT=process.env.PORT || 3000;


app.use("/",staticRoutes);
app.use("/user",userRoutes);
app.use('/url',urlRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})


