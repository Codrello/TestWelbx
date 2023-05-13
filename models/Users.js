const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Users = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Login:{
        type:String,
        required:true,
        unique: true
    },
    Password:{
        type:String,
        required:true
    },
    Gander:{
        type:String,
        required:true
    },
    Avatar:{
        type:String
    },
    DateReg:{
        type:String
    }

})


module.exports = mongoose.model("Users",Users);



