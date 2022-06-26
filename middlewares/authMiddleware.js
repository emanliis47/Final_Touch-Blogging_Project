const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")
const checkValid = require("../validations/checkValid")
const { isValidObjectId } = checkValid

const authenticate = async function (req, res, next) {
  try {
      let token = req.headers["x-api-key"];
      if (!token) token = req.headers["x-api-key"];
      if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
      console.log(token);
      let decodedToken = jwt.verify(token, "weAreThree", function(err, decoded) {
        if (err) {
            console.log(err.message)
        } else return decoded
    });
    console.log(decodedToken)


    if (!decodedToken) {
        return res.status(400).send({ status: false, msg: "Invalid authentication token in request" });
    }
    req["authorId"] = decodedToken.authorId;
      next()
  }
  catch (err) {
      res.status(500).send({ Status: false, mgs: err.message })
  }
}

const authorise = async function (req, res, next) {
  try {
      let blogId = req.params.blogId;
      if (!isValidObjectId(blogId)) {
          return res.status(400).send({ status: false, msg: `no such as an _id:${blogId} found` }) 
      }
      let findAuthorId = await blogModel.findById(blogId)
      let authorId = findAuthorId.authorId
      let token = (req.headers["x-api-key"]);

      if (!token) {
          return res.status(403).send({ status: false, message: "Missing authentication token in request" });
      }
      let decodedToken = jwt.verify(token, "weAreThree",  function(err, decoded) {
          if (err) {
              console.log(err.message)
          } else return decoded
      });
      console.log(decodedToken)


      if (!decodedToken) {
          return res.status(400).send({ status: false, msg: "Invalid authentication token in request" });
      }
      req["authorId"] = decodedToken.authorId;
      let tokenauthorId = decodedToken.authorId
      if (tokenauthorId != authorId) return res.status(403).send({ Status: false, msg: "You Can't Access It" })
      next();
  }

  catch (error) {
      console.error(`Error! ${error.message}`)
      res.status(500).send({ status: false, message: error.message });
  }
}
module.exports={ authenticate, authorise }