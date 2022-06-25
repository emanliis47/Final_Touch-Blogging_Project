const express =require("express")
const router = express.Router()
const userLogin = require("../logins/userLogin")
const {loginAuthor} = userLogin
const authorController = require("../controllers/authorController")
const {createAuthor} = authorController
const blogController = require("../controllers/blogController")
const { createBlog, listOfBlogs, updateblog, deleteBlogById, deletBlogByParams } = blogController
const authMiddleware = require("../middlewares/authMiddleware")
const { authenticate, authorise} = authMiddleware
 router.post("/authors", createAuthor)
router.post("/blogs", createBlog)
 router.post("/login", loginAuthor)
router.get("/blogs",  authenticate, listOfBlogs)

router.put("/blogs/:blogId", authenticate, authorise,  updateblog)
router.delete("/blogs/:blogId", authenticate, authorise,  deleteBlogById)
router.delete("/blogs",  deletBlogByParams)
module.exports = router