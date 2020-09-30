const express = require("express");
const mongoose  = require("mongoose");
const bodyParser = require("body-parser");
const cors=require("cors");

//App is initialised
const app=express();

//Middlewares
app.use(bodyParser.json());
app.use(cors());
require("dotenv/config");

//Routes 
const testRoutes = require("./routes/post");
app.use('/users',testRoutes);

//Connecting to mongoose server
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true })
    .then(()=>{console.log("Connected to mongodb cluster")})
    .catch((err)=>{console.error(err)});

//listening at port 3000
app.listen(5555,()=>{
    console.log("Listening on port 5555")
});