const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth-middleware');
const upload = require("../middlewares/multer");
const { validateBlog } = require('../middlewares/blogValidator');
const blogController = require('../controllers/blogControllers');

router.post('/create', auth, upload.single('image'), validateBlog, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

router.post('/like/:id', auth, blogController.toggleLikeBlog);
router.post('/comment/:id', auth, blogController.addComment);
router.get('/comments/:id', blogController.getComments);


module.exports = router;
