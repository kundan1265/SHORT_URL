const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {connectionMongoDb} = require("./connection");
const { restricToLoggedUserOnly , checkAuth} = require("./middleware/auth");


const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const URL = require("./model/url");
const mongoose = require("mongoose");
const { Timestamp } = require("bson");


const app = express();
const PORT = 8001;

connectionMongoDb("mongodb+srv://kundano1265:Kundan2@cluster0.hirks.mongodb.net/")
.then(() => console.log("mongodb connected"));

app.set("view engine" , "ejs");
app.set('views' , path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use("/url" ,restricToLoggedUserOnly , urlRoute);
app.use("/user" , userRoute);
app.use('/' ,checkAuth , staticRoute);

app.get("/:shortId" , async (req , res) => {
    try{
    const shortid = req.params.shortId;
    //console.log(shortid)
    const entry = await URL.findOneAndUpdate({
       shortId : `${shortid}`
    },
    {
     $push: {
         visitHistory: {
             Timestamp: Date.now(),
         }
     }
    },{ new: true },
    );
    res.redirect(entry.redirectURL);
    }catch(err){
        res.status(400).json({message: err.message});
    }
 });

app.listen(PORT , () =>{ console.log(`server started at PORT ${PORT}`)});
