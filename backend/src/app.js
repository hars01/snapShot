require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uploadFile = require('./services/storage.service');
const  postModel = require("./models/post.model")


const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }) //jab hum text na bhej ke file bhejte hai server me toh ye express ke server ko help karta hai file data ko read karne me

app.post('/create-post', upload.single("image"), async(req, res) => {
    console.log(req.body); // ye caption(normal text) ko output deta hai
    console.log(req.file); // ye file show karega

    const result = await uploadFile(req.file.buffer)
    console.log("Result Link", result);

    const post = await postModel.create({
        image: result.url,
        caption: req.bady.caption
    })

    return res.status(201).json({ 
        message: "Post Created Successfully",
        post
     })
})

app.get('/posts', async (req, res) => {
    const posts = await postModel.find().sort({ createdAt: -1 }); // ye latest post ko pehle show karega
    
    return res.status(200).json({ 
        message: "Posts fetched successfully",
        posts
     })
     
})


module.exports = app