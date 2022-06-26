const express =require("express")
const router = express.Router()
const userLogin = require("../logins/userLogin")
const {loginAuthor} = userLogin
const authorController = require("../controllers/authorController")
const {createAuthor} = authorController
const blogController = require("../controllers/blogController")
const { createBlog, listOfBlogs, updateblog, deleteBlogById, deletBlogByParams } = blogController //DESTRUCTURING IN OBJECTS
const authMiddleware = require("../middlewares/authMiddleware")
const { authenticate, authorise} = authMiddleware
//READONLY LEVEL API
 router.get("/blogs",  authenticate, listOfBlogs)
//WRITE LEVEL API
router.post("/authors", createAuthor)
router.post("/login", loginAuthor)
router.post("/blogs", authenticate, createBlog)
router.put("/blogs/:blogId", authenticate, authorise,  updateblog)
router.delete("/blogs/:blogId", authenticate, authorise,  deleteBlogById)
router.delete("/blogs", authenticate, deletBlogByParams)
module.exports = router