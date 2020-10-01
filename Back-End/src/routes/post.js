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
router.post("/addserver", ({body:{username,user,serverName,sshKey,password,ipAddr}},res)=>{
   //console.log(req.body);
    User.findOne({username:username}).exec((err,result)=>{
        if(err){
            res.json({message:err});
            throw(err)           
        }
        else{
            if(result){
                if(result.servers.length===0){
                    result.servers.push({
                        user:user,
                        serverName:serverName,
                        sshKey:sshKey,
                        password:password,
                        ipAddr:ipAddr
                    })
                    result.save();
                    res.send("New Server Created!")
                }
                else{
                    const nameNotAvailable = (result.servers).map((el)=>el.serverName===serverName).some((el)=>el===true)
                    //returns an array with same size of resultant.servers containing boolean values and .some() checks if any value inside the array is true.If any value is true then nameNotAvailable gets the value true
                    if(nameNotAvailable){
                        res.send("Server already exists. Did not add server");
                    }
                    else{
                        result.servers.push({
                            user:user,
                            serverName:serverName,
                            sshKey:sshKey,
                            ipAddr:ipAddr,
                            password:password
                        });
                        result.save();
                        res.send("Added server to list of existing servers");
                    }
                    }
            }
            else{
                res.send("User does not exist.Please check username again!");
            }
        }
    }

    )
});
router.post("/removeserver", ({body:{username,serverName}},res)=>{
    User.findOne({username:username}).exec((err,result)=>{
        if(err){
            res.json({message:err})
            throw err
        }
        else{
                 if(result){
                const serverExists = result.servers
                .map((el)=>el.serverName===serverName)
                .some((el)=>el);//returns a boolean value true if serverName matches the inputed serverName
                if(serverExists){
                    const serverIdx = result.servers
                    .map((el)=>el.serverName===serverName)
                    .indexOf(true);//find the index where value is true/1
                    result.servers.splice(serverIdx,1);//This removes 1 element from the index which is equal to serverIdx
                    result.save()
                    res.send(`Server with name ${serverName} has been removed from list of servers`);
                }
                else{
                    res.send("Server does not exist");
                }
            }
            else{
                res.send("User does not exist. Please check username again!")
            }
        }
    })
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
