const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ authenticated: false });
  }
};

// API routes
app.get('/api/auth/check', (req, res) => {
  res.json({ authenticated: !!req.session.user });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'xrafi' && password === 'rafiur@@') {
    req.session.user = { username };
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
});

app.get('/api/posts', requireAuth, async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

app.post('/api/posts', requireAuth, upload.single('image'), async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.file ? `/uploads/${req.file.filename}` : null
  });
  await post.save();
  res.json(post);
});

app.delete('/api/posts/:id', requireAuth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/post.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'post.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
