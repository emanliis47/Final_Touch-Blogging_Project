const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const checkValid = require("../validations/checkValid")
const {isValid, isValidRequestBody, isValidObjectId} = checkValid
const createBlog = async function (req, res) {
  try {
      let requestBody = req.body;
      if (!isValidRequestBody(requestBody)) {
          res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
          return
      }
      let { title, body, authorId, tags, subcategory, isPublished, category } = requestBody;

      if (!isValid(title)) {
          res.status(400).send({ status: false, message: "Blog Title is required" })
          return
      }
      if (!isValid(body)) {
          res.status(400).send({ status: false, message: "Blog body is required" })
          return
      }
      if (!isValid(authorId)) {
          res.status(400).send({ status: false, message: "Author id is required" })
          return
      }
      if (!isValidObjectId(authorId)) {
          res.status(400).send({ status: false, message: `${authorId} is not a valid author id` })
          return
      }
      if (!isValid(category)) {
          res.status(400).send({ status: false, message: "Blog category is required" })
          return
      }
      const author = await authorModel.findById(authorId);
      if (!author) {
          res.status(400).send({ status: false, message: "Author does not exist" })
          return
      }
      
      const newBlog = await blogModel.create(requestBody)
      res.status(201).send({ status: true, message: "New blog created sucessfully", data: newBlog })
  }
  catch (error) {
      res.status(500).send({ status: false, message: error.stack });
  }
}



const listOfBlogs = async function (req, res) {
  try {
    const queryParams = req.query

    const fillterBlog = {
        isDeleted: false,
        isPublished: true
    }

    const { authorId, category, tags, subcategory } = queryParams

    if (authorId) {
        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: 'invalid authorid ' })
        }
        fillterBlog['authorId'] = authorId
    }

    if (category) {
        fillterBlog['category'] = category
    }

    if (tags) {
        fillterBlog['tags'] = tags
    }

    if (subcategory) {
        fillterBlog['subCategory'] = subcategory
    }

    const blogs = await blogModel.find(fillterBlog).populate("authorId");

    if (blogs.length == 0) {
        return res.status(404).send({ status: false, message: "No blogs Available." })
    }
    res.status(200).send({ status: true, data: blogs });
  }
  catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}

const updateblog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let bodyData = req.body;
    if (!isValidRequestBody(bodyData)) {
          res.status(400).send({ status: false, message: "Invalid request body. Please provide another details" })
          return
      }
    if (!isValidObjectId(blogId)) {
         res.status(400).send({ status: false, msg: `${blogId} is not a valid ` }) 
         return
    }
    let user = await blogModel.findById(blogId);
    if (!isValid(user) || user.isDeleted === true) {
         res.status(400).send({ status: false, msg: " no such data as found" })
         return
    }
    if (!isValid(bodyData))  return res.status(400).send({ status: false, msg: "no data to update" }) 
    bodyData.isPublished = true
    bodyData.publishedAt = new Date()
    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, bodyData, { new: true })
    res.status(200).send({ status: true, messgae: "Blog updated sucessfully", data: updatedBlog })}

  catch (error) {
      res.status(500).send({ status: false, message: error.stack });
  }
}

const deleteBlogById = async function (req, res) {
  try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: `${blogId} is not a valid` })
        }
        let isdeletedor= await blogModel.findOne({_id:blogId , isDeleted: true})
        console.log(isdeletedor)
        if (isdeletedor) return res.status(404).send({ status: false, message: "No matching blog found" }) 
        let findBlogId = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } })
        res.status(200).send({ status: true, message: "Blog(s) deleted sucessfully"})
    }
  catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}

const deletBlogByParams = async function (req, res) {
  try {
      const filterQuery = { isDeleted: false, deletedAt: null }
      const queryParams = req.query
      const { authorId, category, tags, subcategory, isPublished } = queryParams
      if (!isValidRequestBody(queryParams)) {
          res.status(400).send({ status: false, message: "No query params received . Aborting delete operadtion" })
          return
      }
     
      if (isValid(authorId) && isValidObjectId(authorId)) {
          filterQuery["authorId"] = authorId
      }
      if (isValid(category)) {
          filterQuery["category"] = category.trim()
      }
      if (isValid(isPublished)) {
          filterQuery["isPublished"] = isPublished
      }
      if (isValid(tags)) {
          const tagArr = tags.trim().split(",").map(tag => tag.trim());
          filterQuery["tags"] = { $all: tagArr }
      }
      if (isValid(subcategory)) {
          const subcatArr = subcategory.trim().split(",").map(subcat => subcat.trim());
          filterQuery["subcategory"] = { $all: subcatArr }
      }
      const blogs = await blogModel.find(filterQuery);
      if (Array.isArray(blogs) && blogs.length === 0) {
          res.status(404).send({ status: false, message: "No matching blog found" })
          return
      }
      await blogModel.updateMany({ _id: { $in:  blogs } }, { $set: { isDeleted: true, deletedAt: new Date() } })
      res.status(200).send({ status: true, message: "Blog(s) deleted sucessfully" });
  }
  catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}
module.exports = { createBlog, listOfBlogs, updateblog, deleteBlogById, deletBlogByParams }
