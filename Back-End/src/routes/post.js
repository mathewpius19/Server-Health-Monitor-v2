const express= require("express");
const User = require("../models/users")
const router = express.Router();
const request = require("request");
const bcrypt=require("bcrypt");
const {Client} = require("ssh2");

// router.get('/get', (req,res)=>{
//     res.send("We are at home!");
// })

router.post("/signup", async({body:{firstName,lastName,username,password,email}},res)=>{
    const userObj = await User.findOne({username:username},"username");
    if(userObj){
        res.send("Username already exists");
    }
    else{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,
                (err,hash)=>{
                    const newUser = new User({
                        firstName:firstName,
                        lastName:lastName,
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
                        const newServer={
                            user:user,
                            serverName:serverName,
                            sshKey:sshKey,
                            ipAddr:ipAddr,
                            password:password
                        };
                        result.servers.push(newServer);
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
router.post("/getservers", ({body:{username,password}},res)=>{
    User.findOne({username:username}).exec(
        async (err,result)=>{
        if(err){
            res.json({message:err})
            throw err
        }
        else{
            if(result){
                const {hash, servers} = result;
                const checkAuthentication = await bcrypt.compare(password,hash);
                if(checkAuthentication){
                    res.send(servers)
                }
                else{
                    res.send("Authentication Failed. Did not retrieve servers");
                }
                }
                else{
                    res.send("User does not exist")
                }

            }
        }
    )
})
//this is under /health routes
router.post("/display", ({body:{username,password,serverName,details}},res)=>{
   //console.log(req.body);
    User.findOne({username:username}).exec(async (err,result)=>{

        if(err){
            res.json({message:err})
        }
        else{
            if(result){
                // console.log(user, serverName, details,username, password);
                const {hash, servers} = result;
                const checkAuthentication = await bcrypt.compare(password,hash)
                    if(checkAuthentication){
                        const serverIdx = servers.map((el)=>el.serverName===serverName).indexOf(true)
                        const {user} = servers[serverIdx];
                        request.post({
                            url:"http://167.71.237.73:4400/Display",
                            json:{
                                Username:user,
                                Servername:serverName,
                                Details:details
                     
                            },
                            headers:{
                                'Content-type':'application/json'
                             }
                        },
                        (err, {body}) => {
                                if (err) {
                                    res.json({ message: err });
                                }
                                res.send(body);
                            });
                        
                    }
                    else{
                        res.send("Retrieval of data failed.Invalid credentials")
                    }
               }
                else{
                    res.send("User does not exist");
                }
            }
    })
})





router.post("/setupserver", ({body:{username,serverName,password}},res)=>{
    User.findOne({username:username}).exec(
        async(err,result)=>{
        if(err){
            res.send("Error occured")
            throw err
        }
        else{
            if(result){
            const {hash, servers} = result
            const checkAuthentication = await bcrypt.compare(password,hash)
            if(checkAuthentication){
                const serverIndex = servers.map((el)=>el.serverName===serverName).indexOf(true)
                const{user, password,ipAddr} = servers[serverIndex]
                const command = await sshInitSetupServer(user, password, ipAddr,serverName, res)
                }
            }   
            else{
                res.send("User does not exist")
            }
        }

    })

})

//----Automated SSH --------------------------------------------------------------------------------------------------------------------------------------------------------------
async function sshInitSetupServer(user, password, host,serverName, res){
    const connDetails = {
        host:host,
        port:22,
        username:user,
        password:password,
        serverName:serverName

    };
    // console.log(connDetails);
    const conn = new Client()
    let log = "";
    // console.log("Client::READY")
    conn.on("ready", ()=>{
        log+="Server Health Monitor has successfully connected to Remote Server";
        conn.exec(
            `git clone https://github.com/mathewpius19/Health-Monitoring.git;cd Health-Monitoring/;
            echo ${password}|sudo -S npm i socket.io os-utils forever;
            npx forever start websockets.js;
            echo ${password} | sudo -S chmod 777 *.py;
            python3 requirements.py ${password} ${user} ${serverName};
            
            `,
            (err,stream)=>{
                if(err){
                    log+="Connection Failed";
                }
                stream.stdout.on("data",(data)=>{
                    log+=`\n***\n STDOUT : \n${data.toString()}\n***`;
                })
                stream.stderr.on("data",(data)=>{
                    log+=`\n***\n${data.toString()}\n***`
                })
                stream.on("close", ()=>{
                    log+="\n Connection closed from server \n";
                    conn.end();
                })
            }
        )
    })
    conn.on("end",()=>{
        log+="\n Disconnected from server";
        res.send(`\n Log:${log}`)

    })
    conn.on("err",()=>{
        log+="\n error occurred \n"
    })
    conn.connect(connDetails);
}


module.exports=router;
