const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const config = require("config");

const Book = require("../models/Book");

// @route       POST api/users
// @desc        Register user
// @access      Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    // check name if it's okay
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //Our validationresult filled with errors if there is any and we start doing stuff below
    if (!errors.isEmpty()) {
      //change status and give a response with errors array so client can see what's wrong
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      //SEE IF THE USER EXISTS
      let book = await Book.findOne({ name });
      if (book) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
        //we gave error message that way because it's the same as the
        //error message above so client can handle them in same way
      }
      // if the don't return that(res above) there it will give some strange errors because
      //it'll consired us as trying to send headers again
      const length = await Book.count();
      book = new Book({
        name,
        customid: length + 1,
      });

      //the line below saves user to the database
      await book.save();
      res.status(200).json({ results: [{ book }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
//for example if we send request to requests instead / it will be something like that api/users/requests now it's like api/users/

// @route       GET api/users/
// @desc        Get all users
// @access      Public
router.get("/", async (req, res) => {
  try {
    //I want to create a const called profiles and feed it with all profiles and populate them with names and avatars from user collection
    // Basically adding user name and avatar to profile from other collection
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route       GET api/users/:user_id
// @desc        Get profile by user id
// @access      Public
router.get("/:books_id", async (req, res) => {
  try {
    //Put the requested user in a variabl
    const book = await Book.findOne({
      customid: req.params.books_id,
    });
    console.log(req.params.books_id);

    if (!book) return res.status(400).send({ msg: "Book not Found" });

    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: "Profile not Found" });
    }
    res.status(500).send("server error");
  }
});

module.exports = router;
