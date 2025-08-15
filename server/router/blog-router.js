const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth-middleware');
const upload = require("../middlewares/multer");
const { validateBlog } = require('../middlewares/blogValidator');
const blogController = require('../controllers/blogControllers');
const userProfileController = require('../controllers/userProfileController');

// Blog CRUD
router.post('/create', auth, upload.single('image'), validateBlog, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

// Likes & Comments
router.post('/like/:id', auth, blogController.toggleLikeBlog);
router.post('/comment/:id', auth, blogController.addComment);
router.get('/comments/:id', blogController.getComments);

// Categories
router.get('/categories/list', blogController.getCategories);
// New route: Get all blogs authored by a specific user
router.get('/user/:userId', auth, userProfileController.getUserBlogs);


module.exports = router;
