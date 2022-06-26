const checkValid = require("../validations/checkValid")
const {isValid, isValidRequestBody } = checkValid
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const loginAuthor = async function (req, res) {
  try {
      let requestBody = req.body;
      if (!isValidRequestBody(requestBody)) {
          res.status(400).send({ status: false, message: "Invalid request parameters. Please provide another details" })
          return
      }
      const {email, password}= requestBody;
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
      let author = await authorModel.findOne({ email, password});

      if (!author) {
          res.status(401).send({ status: false, msg: "Invalid login credentials" });
          return
      }

      let token = await jwt.sign(
          {
              authorId: author._id,
              iat: Math.floor(Date.now()/ 1000),
              exp: Math.floor(Date.now()/ 1000) + 10*60*60,
              batch: "Radon",
              project: "Blogging"
          },
          "weAreThree"
      );

      res.status(200).send({ status: true, message: `User login sucessfull `, data: {token}});
  }
  catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
};
module.exports.loginAuthor= loginAuthor