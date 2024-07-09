// Imports
const router = require('express').Router();
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Route to render homepage with all blog posts
router.get("/", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        { model: User, attributes: ["name"] },
        { model: Comment, attributes: ["comment_body"], include: [User] }
      ]
    });

    // Mapping blogPostData to plain objects for rendering
    const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

    res.render('homepage', {
      blogPosts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json(err);
  }
});

// Route to render a single blog post with comments
router.get('/blogPost/:id', withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Comment, include: [User] }
      ]
    });

    if (!blogPostData) {
      res.status(404).json({ message: 'No blog post found with this id' });
      return;
    }

    const blogPost = blogPostData.get({ plain: true });

    res.render('blogPost', {
      ...blogPost,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json(err);
  }
});

// Route to render the dashboard for a logged-in user
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: BlogPost, include: [User] },
        { model: Comment }
      ]
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json(err);
  }
});

// Route to render the new post creation form
router.get('/create', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.render('create', {
        logged_in: req.session.logged_in,
        userId: req.session.user_id
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error('Error rendering create page:', err);
    res.status(500).json(err);
  }
});

// Route to render the edit post form
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Comment, include: [User] }
      ]
    });

    if (!blogPostData) {
      res.status(404).json({ message: 'No blog post found with this id' });
      return;
    }

    const blogPost = blogPostData.get({ plain: true });

    res.render('edit', {
      ...blogPost,
      logged_in: req.session.logged_in,
      userId: req.session.user_id
    });
  } catch (err) {
    console.error('Error rendering edit page:', err);
    res.status(500).json(err);
  }
});

// Route to handle login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// Export router
module.exports = router;