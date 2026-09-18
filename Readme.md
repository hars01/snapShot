# SnapShot Project Documentation

## 1. Project Overview

SnapShot is a full-stack social media-style app where users can upload an image with a caption and view all posts in a feed. The app has two main parts:

- Backend: Node.js + Express + MongoDB + Multer + ImageKit
- Frontend: React + Vite + Axios + Tailwind CSS

The purpose of the application is to:

1. Accept a post with an image and caption from the frontend
2. Upload the image to ImageKit cloud storage
3. Save the returned ImageKit URL into MongoDB
4. Fetch posts from MongoDB and render them on the feed page

---

## 2. Original Problem and Root Cause

The app was not fully working because multiple layers had bugs:

### Backend bugs
- The caption was saved using the wrong field name: `req.bady.caption`
- The app did not validate whether an image existed before upload
- The ImageKit upload config was incomplete
- The app did not handle missing/null image or caption values properly
- The returned data from MongoDB was not formatted cleanly for the client

### Frontend bugs
- The create-post form sent multipart form data but without a proper `Content-Type` header
- The feed page incorrectly did `setPosts(res.data)` instead of `setPosts(res.data.posts)`
- The feed used the wrong keys (`post.id` instead of `post._id`)
- The app was originally using plain CSS instead of a modern utility-based styling system

### CSS/Tailwind issue
The earlier runtime error occurred because the project attempted to import Tailwind in a way that wasn’t installed or initialized correctly. The real error was not in MongoDB or ImageKit itself; it was a Vite/CSS resolution issue caused by a stale dev server setup and missing Tailwind integration.

---

## 3. What Changed in the Code

### 3.1 Backend file: `backend/src/app.js`

The route `/create-post` was rewritten to safely handle uploads and store the data properly.

#### Previous issue
The original route had this logic:

```js
const post = await postModel.create({
  image: result.url,
  caption: req.bady.caption
})
```

This fails because `req.bady.caption` is misspelled. The correct value is `req.body.caption`.

#### Updated logic
```js
const caption = (req.body.caption || '').trim();
if (!caption) {
  return res.status(400).json({ message: 'Caption is required.' });
}
```

This ensures:
- no empty caption is saved
- bad input is rejected before sending to the database
- the app returns a clear message to the frontend instead of crashing

The route also checks:

```js
if (!req.file) {
  return res.status(400).json({ message: 'Image file is required.' });
}
```

This prevents invalid requests where someone submits a post without uploading an image.

The upload route now does this:

```js
const result = await uploadFile(req.file.buffer, req.file.originalname || 'snapshot-post');
```

This passes the actual file buffer and name to the ImageKit uploader, which is necessary because image uploads require binary data and a valid filename.

The final create-post response is:

```js
return res.status(201).json({
  message: 'Post Created Successfully',
  post,
});
```

This gives the frontend valid feedback after success.

---

### 3.2 Backend file: `backend/src/services/storage.service.js`

This file handles sending the image file to ImageKit.

#### Original problem
The previous version used only:

```js
const imagekit = new ImageKit({
  privateKey: process.env['ImageKit_Private_Key']
});
```

This was incomplete because ImageKit usually needs:
- `privateKey`
- `publicKey`
- `urlEndpoint`

Without these, the upload request is not fully authenticated and may fail or produce incorrect behavior.

#### Updated version
```js
const imagekit = new ImageKit({
  privateKey: process.env.ImageKit_Private_Key,
  publicKey: process.env.ImageKit_Public_Key,
  urlEndpoint: process.env.ImageKit_Url_Endpoint,
});
```

Then the upload uses:

```js
const result = await imagekit.files.upload({
  file: buffer.toString('base64'),
  fileName,
  useUniqueFileName: true,
  folder: '/snapShot/posts',
});
```

#### Why this is important
- `buffer.toString('base64')` converts binary image data into a format that ImageKit accepts
- `useUniqueFileName: true` ensures each file has a distinct name
- `folder: '/snapShot/posts'` organizes uploads in a dedicated folder inside ImageKit
- the returned `result.url` is the permanent cloud URL that we store in MongoDB

This is the core reason the uploaded image can be retrieved later from the feed.

---

### 3.3 Backend file: `backend/src/models/post.model.js`

The model was improved to enforce better data quality.

#### Updated schema
```js
const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
```

#### Why this matters
- `image` must always exist
- `caption` must always exist
- `trim()` removes unwanted spaces from the caption
- `timestamps: true` creates `createdAt` and `updatedAt`, which are useful for sorting posts by newest first

This gives the frontend an easier and more consistent data model.

---

### 3.4 Frontend file: `frontend/src/pages/CreatePost.jsx`

The create-post form was corrected to send the image and caption properly.

#### Updated logic
```js
const formData = new FormData(e.target);
const file = formData.get('image');

if (!file || file.size === 0) {
  alert('Please select an image before posting.');
  return;
}
```

Then the request is sent as:

```js
await axios.post('http://localhost:3000/create-post', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

#### Why this matters
A normal `axios.post` with JSON cannot upload binary files correctly. For image uploads, we use `FormData`, and the correct multipart header ensures the server reads the file data successfully.

This is the correct way to send a file and text in the same request.

---

### 3.5 Frontend file: `frontend/src/pages/Feed.jsx`

The feed was fixed because it was reading the response incorrectly.

#### Old bug
```js
setPosts(res.data)
```

But the backend sends:

```js
return res.status(200).json({
  message: 'Posts fetched successfully',
  posts,
});
```

So the actual data is inside `res.data.posts`, not `res.data`.

#### Corrected logic
```js
const res = await axios.get('http://localhost:3000/posts');
setPosts(res.data.posts || []);
```

Also, the UI uses:

```js
key={post._id}
```

instead of `post.id`, because MongoDB documents use `_id`.

This fixes rendering errors and ensures each post card maps to the correct item.

---

### 3.6 Frontend styling: Tailwind migration

The project was moved from plain CSS to Tailwind for a cleaner and more modern UI.

#### Requirement
The frontend was transformed to include:
- modern glassmorphism cards
- gradient CTA buttons
- hover animation
- card lifts and image zoom effects
- dark mode visual design

#### Updated styling approach
The app now uses:

```css
@import 'tailwindcss';
```

and a custom animation class:

```css
@keyframes floatIn {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-float-in {
  animation: floatIn 0.7s ease-out both;
}
```

This creates a soft fade-in transition for the form container.

The Vite configuration was updated to include Tailwind:

```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

#### Why this was needed
Tailwind provides a utility-first approach that speeds up styling and makes the UI easier to maintain than custom long CSS blocks.

It also matches the requirement for modern animation and a cleaner UI layout.

---

## 4. How the Full App Flow Works

### Upload post flow
1. User selects an image and enters a caption in the frontend form
2. Frontend creates a `FormData` object
3. `axios.post` sends the request to `/create-post`
4. Express receives the file using `multer.memoryStorage()`
5. Server validates that `req.file` exists and `caption` is not empty
6. The image buffer is uploaded to ImageKit
7. ImageKit returns a permanent URL
8. Server saves `{ image: url, caption }` to MongoDB
9. Response is sent back to frontend

### Fetch feed flow
1. Frontend calls `GET /posts`
2. Express runs `postModel.find().sort({ createdAt: -1 })`
3. MongoDB returns the latest posts first
4. Frontend receives the array of posts
5. Feed renders each post image and caption in cards

---

## 5. Why These Exact Changes Were Required

These fixes were not random; each one solved a real issue in the app lifecycle:

- `req.body.caption` fix: because JavaScript field names are case-sensitive and `req.bady` is invalid
- `FormData` + multipart: because image uploads cannot be sent as normal JSON
- ImageKit config: because cloud upload requires proper authentication and endpoint settings
- `res.data.posts`: because backend API response wraps data in a `posts` object
- `_id` instead of `id`: because MongoDB uses `_id`
- Tailwind setup: because the app needed a modern UI system and earlier CSS import failure was blocking frontend startup

---

## 6. Environment Variables Needed

Create a `.env` file inside the backend folder with values similar to:

```env
DBURI=mongodb://localhost:27017/snapshot
PORT=3000
ImageKit_Private_Key=your_private_key
ImageKit_Public_Key=your_public_key
ImageKit_Url_Endpoint=https://ik.imagekit.io/your_url_endpoint/
```

These values are required so:
- MongoDB can connect
- Express can run on the configured port
- ImageKit can authenticate upload requests

---

## 7. Commands to Run

### Backend
```bash
cd backend
npx nodemon server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

---

## 8. Summary

This project is now structured correctly for the modern social-post workflow:

- frontend sends a valid image + caption upload
- backend uploads the image to ImageKit and stores the URL in MongoDB
- feed reads the DB correctly and displays the latest posts
- styling is modern, responsive, and animated using Tailwind CSS

The app is no longer relying on broken assumptions or incorrect field names; it follows the proper full-stack data flow required for file uploads and post rendering.
