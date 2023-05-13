const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Products = new Schema({
    Image:{
        type:String
    },
    Subject:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Author:{
        type:String
    },
    AuthorID:{
        type:String
    },
    DateOfAddition:{
        type:String
    }
})



module.exports = mongoose.model("Products", Products);
