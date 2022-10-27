const mongoose = require('mongoose')
const credSchema = new mongoose.Schema({
    name : {
        type : String,
        required:true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
    
})
module.exports = mongoose.model('credentialModel',credSchema)