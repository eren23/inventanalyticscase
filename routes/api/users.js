const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
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
      let user = await User.findOne({ name });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
        //we gave error message that way because it's the same as the
        //error message above so client can handle them in same way
      }
      // if the don't return that(res above) there it will give some strange errors because
      //it'll consired us as trying to send headers again
      const length = await User.count();

      user = new User({
        name,
        customid: length + 1,
      });

      //the line below saves user to the database
      await user.save();
      res.status(200).json({ results: [{ user }] });
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
    const profiles = await User.find();
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route       GET api/users/:user_id
// @desc        Get profile by user id
// @access      Public
router.get("/:users_id", async (req, res) => {
  try {
    //Put the requested user in a variable
    const user = await User.findOne({
      customid: req.params.users_id,
    });
    console.log(req.params.users_id);

    if (!user) return res.status(400).send({ msg: "User not Found" });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: "Profile not Found" });
    }
    res.status(500).send("server error");
  }
});

// @route       POST api/users/:user_id/borrow/:book_id
// @desc        Get profile by user id
// @access      Public
router.post("/:users_id/borrow/:books_id", async (req, res) => {
  try {
    //Put the requested user in a variable
    const user = await User.findOne({
      customid: req.params.users_id,
    });
    console.log(req.params);

    if (!user) return res.status(500).send({ msg: "User not Found" });

    const book = await Book.findOne({
      customid: req.params.books_id,
    });

    if (!book) return res.status(500).send({ msg: "Book not Found" });

    if (book.available == false)
      return res.status(500).send({ msg: "Book not available" });

    const bookToAdd = { name: book.name };
    user.currentbook.unshift(bookToAdd);
    book.available = false;
    await user.save();
    await book.save();
    res.json(user);
    console.log(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: "Profile not Found" });
    }
    res.status(500).send("server error");
  }
});

// @route       POST api/users/:user_id/borrow/:book_id
// @desc        Get profile by user id
// @access      Public
router.post("/:users_id/return/:books_id", async (req, res) => {
  try {
    //Put the requested user in a variable
    const user = await User.findOne({
      customid: req.params.users_id,
    });

    if (!user) return res.status(500).send({ msg: "User not Found" });

    const book = await Book.findOne({
      customid: req.params.books_id,
    });

    if (!book) return res.status(500).send({ msg: "Book not Found" });

    let ifBookExist = false;

    const removeIndex = user.currentbook
      .map((item) => item.name)
      .indexOf(book.name);

    user.currentbook.map((books) => {
      if (book.name === books.name) {
        return (ifBookExist = true);
      }
    });

    if (ifBookExist == false)
      return res.status(500).send({ msg: "Book doesn't belong to the user" });

    user.currentbook.splice(removeIndex, 1);

    const score = req.body.score;
    const bookToReturn = { name: book.name, date: Date.now };
    user.oldbook.unshift(bookToReturn);
    book.available = true;

    if (book.reviewcounter == 0) {
      book.review = score;
    } else {
      book.review =
        (book.review * book.reviewcounter + score) / (book.reviewcounter + 1);
    }
    book.reviewcounter++;

    await user.save();
    await book.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: "Profile not Found" });
    }
    res.status(500).send("server error");
  }
});
module.exports = router;
