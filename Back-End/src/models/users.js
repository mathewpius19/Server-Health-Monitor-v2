const mongoose = require("mongoose");
const UsersSchema = mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    username:{
        required:true,
        type:String,
    },
    hash:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requried:true
    },
    servers:[
        {
            user:{
                type:String,
            },
            serverName:{
                type:String
            },
            ipAddr:{
                type:String
            },
            sshKey:{
                type:String
            },
            password:{
                type:String
            },
        }
    ]
});
module.exports = mongoose.model("Users",UsersSchema);