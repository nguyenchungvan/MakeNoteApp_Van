const mongoose = require('mongoose'); // Erase if already required
const ObjectId = mongoose.Schema.ObjectId;

// Declare the Schema of the Mongo model
var noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    image: {
        type: String,
    },
    userId:{
        type:ObjectId,
        required:true,
    }
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Note', noteSchema);