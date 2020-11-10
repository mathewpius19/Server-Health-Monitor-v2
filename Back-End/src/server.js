const express = require("express");
const mongoose  = require("mongoose");
const bodyParser = require("body-parser");



//App is initialised
const app=express();

//Middlewares
app.use(bodyParser.json());
require("dotenv/config");


//Routes 
const testRoutes = require("./routes/post");
app.use('/users',testRoutes);
const healthRoutes = require("./routes/post");
app.use("/health",healthRoutes);

//Connecting to mongoose server
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true })
    .then(()=>{console.log("Connected to mongodb cluster")})
    .catch((err)=>{console.error(err)});

//listening at port 3000
app.listen(5550,()=>{
    console.log("Listening on port 5550")
});