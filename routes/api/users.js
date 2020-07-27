const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Book = require("../models/Book");

// @route       POST /users
// @desc        Register user
// @access      Public
router.post(
  "/",
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      let user = await User.findOne({ name });
      if (user) {
        return res
          .status(500)
          .json({ errors: [{ msg: "User already exist" }] });
      }
      const length = await User.count();

      user = new User({
        name,
        customid: length + 1,
      });
      await user.save();
      res.status(200).json({ results: [{ user }] });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route       GET /users
// @desc        Get all users
// @access      Public
router.get("/", async (req, res) => {
  try {
    const profiles = await User.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).send("server error");
  }
});

// @route       GET /users/:user_id
// @desc        Get profile by user id
// @access      Public
router.get("/:users_id", async (req, res) => {
  try {
    const user = await User.findOne({
      customid: req.params.users_id,
    });

    if (!user) return res.status(400).send({ msg: "User not Found" });

    res.json(user);
  } catch (err) {
    res.status(500).send("server error");
  }
});

// @route       POST /users/:user_id/borrow/:book_id
// @desc        Borrow a book
// @access      Public
router.post("/:users_id/borrow/:books_id", async (req, res) => {
  try {
    const user = await User.findOne({
      customid: req.params.users_id,
    });

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
  } catch (err) {
    res.status(500).send("server error");
  }
});

// @route       POST /users/:user_id/borrow/:book_id
// @desc        Return a book
// @access      Public
router.post(
  "/:users_id/return/:books_id",
  [check("score", "Score is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    try {
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
      const bookToReturn = { name: book.name };
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
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
