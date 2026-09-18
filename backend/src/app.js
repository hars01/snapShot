require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const uploadFile = require('./services/storage.service');
const postModel = require('./models/post.model');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post('/create-post', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const caption = (req.body.caption || '').trim();
    if (!caption) {
      return res.status(400).json({ message: 'Caption is required.' });
    }

    const result = await uploadFile(req.file.buffer, req.file.originalname || 'snapshot-post');

    const post = await postModel.create({
      image: result?.url || result?.filePath || '',
      caption,
    });

    return res.status(201).json({
      message: 'Post Created Successfully',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      message: 'Unable to create post.',
      error: error.message,
    });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      message: 'Posts fetched successfully',
      posts,
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return res.status(500).json({
      message: 'Unable to fetch posts.',
      error: error.message,
    });
  }
});

module.exports = app;