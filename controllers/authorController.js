const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel")
const checkValid = require("../validations/checkValid")
const {isValid, isValidTitle, isValidRequestBody, isValidObjectId} = checkValid
const createAuthor = async function (req, res) {

  try {
      let requestBody = req.body;
      if (!isValidRequestBody(requestBody)) {
          res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
          return
      }

      let { fname, lname, title, email, password } = requestBody;

      if (!isValid(fname)) {
          res.status(400).send({ status: false, message: "First name is required" })
          return
      }
      
      if (!isValid(lname)) {
          res.status(400).send({ status: false, message: "Last name is required" })
          return
      }
      
      if (!isValid(title)) {
          res.status(400).send({ status: false, message: "Title is required" })
          return
      }
      if (!isValidTitle(title)) {
          res.status(400).send({ status: false, message: "Title should be among Mr, Mrs and Miss " })
          return
      }
      if (!isValid(email)) {
          res.status(400).send({ status: false, message: "Email is required " })
          return
      }
      if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
          res.status(400).send({ status: false, message: "Email should be a valid email address" })
          return
      }
      if (!isValid(password)) {
          res.status(400).send({ status: false, message: "Password is required " })
          return
      }
      const isEmailAlreadyUsed= await authorModel.findOne({email});
      if(isEmailAlreadyUsed){
          res.status(400).send({ status: false, message: `${email} email address is already registered` })
          return
      }
      const authorData = { fname, lname, title, email, password }
      const newAuthor = await authorModel.create(authorData);
      res.status(201).send({ status: true, message:"Author created sucessfully", data:newAuthor  });
  }
  catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}
module.exports.createAuthor= createAuthor