const express= require("express");
const User = require("../models/users")
const router = express.Router();
const request = require("request");
const bcrypt=require("bcrypt");

// router.get('/get', (req,res)=>{
//     res.send("We are at home!");
// })

router.post("/signup", async({body:{firstname,lastname,username,password,email}},res)=>{
    const userObj = await User.findOne({username:username},"username");
    if(userObj){
        res.send("Username already exists");
    }
    else{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,
                (err,hash)=>{
                    const newUser = new User({
                        firstname:firstname,
                        lastname:lastname,
                        username:username,
                        hash:hash,
                        email:email,
                        servers:[]
                    });
                    newUser.save()
                    .then(()=>{
                        res.send("User Created");
                    })
                    .catch((err)=>{
                        res.send(err);
                    })
            })

        })
    }

});
router.post("/signin", ({body:{username,password}},res)=>{
    User.findOne({username:username},"username hash").exec(
        async(err,result)=>{
            if(result){
        const{username,hash} = result;
        const passwordAuth = await bcrypt.compare(password,hash)
        if(passwordAuth){
            res.send("Authentication Successful");
        }
        else{
            res.send("Password Incorrect. Authentication Failed");
        }
        }
        else{
            res.send("User does not exist. Create User");
        }
        })
    
});
router.post("/Add_Server", (req,res)=>{
   console.log(req.body);
//    request.post({
//        url:"http://127.0.0.1/Add_Server",
//        json:{
//           IPAddress:req.body.IPAddress,
//           Servername:req.body.Servername,
//            Username:req.body.Username

//        },
//        headers:{
//            'Content-type':'application/json'
//         }
//    },
//    function (err,response,body){
//    if(err){
//        res.json({message:err})
//    }
//    res.send(body);
// });
});
router.post("/Remove_Server", (req,res)=>{
//    console.log(req.body);
//    request.post({
//        url:"http://127.0.0.1/Remove_Server",
//        json:{
//         Username:req.body.Username,
//         Servername:req.body.Servername
       

//        },
//        headers:{
//            'Content-type':'application/json'
//         }
//    },
//    function (err,response,body){
//    if(err){
//        res.json({message:err})
//    }
//    res.send(body);
// });
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
