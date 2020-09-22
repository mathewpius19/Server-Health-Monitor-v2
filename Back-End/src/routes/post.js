const express= require("express");
const router = express.Router();
const request = require("request");

// router.get('/get', (req,res)=>{
//     res.send("We are at home!");
// })

router.post("/Registration", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/Registration",
       json:{
           Username:req.body.Username,
           Password:req.body.Password,
           Security:req.body.Security

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});
router.post("/login", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/login",
       json:{
           Username:req.body.Username,
           Password:req.body.Password,

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});
router.post("/Add_Server", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/Add_Server",
       json:{
          IPAddress:req.body.IPAddress,
          Servername:req.body.Servername,
           Username:req.body.Username

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});
router.post("/Remove_Server", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/Remove_Server",
       json:{
        Username:req.body.Username,
        Servername:req.body.Servername
       

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});

router.post("/Display", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/Display",
       json:{
           Username:req.body.Username,
          Servername:req.body.Servername,
          Details:req.body.Details

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});
router.post("/security", (req,res)=>{
   console.log(req.body);
   request.post({
       url:"http://127.0.0.1/security",
       json:{
           Username:req.body.Username,
           Security:req.body.Security

       },
       headers:{
           'Content-type':'application/json'
        }
   },
   function (err,response,body){
   if(err){
       res.json({message:err})
   }
   res.send(body);
});
});


module.exports=router;
