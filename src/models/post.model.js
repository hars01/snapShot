const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
         image: String,
         caption: String,
})

const postModel = mongoose.model("post", postSchema) // mongoose.model("post", postSchema) eshme post->collection ka nam hota hai jisme data store kiya jata hai postSchema->ye blueprint hai jo ye batata hai ki data kis tarah se dikhega 

module.exports = postModel;
