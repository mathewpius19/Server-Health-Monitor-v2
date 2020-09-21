const express = require("express");
const app=express();
const bodyParser = require("body-parser");
const cors=require("cors");

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//Routes 
const testRoutes = require("./routes/post");
app.use('/',testRoutes);



//listening at port 3000
app.listen(3000);