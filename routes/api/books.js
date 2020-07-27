const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Book = require("../models/Book");

// @route       POST /books
// @desc        Register books
// @access      Public
router.post(
  "/",
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      let book = await Book.findOne({ name });
      if (book) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      const length = await Book.count();
      book = new Book({
        name,
        customid: length + 1,
      });

      await book.save();
      res.status(200).json({ results: [{ book }] });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route       GET /books
// @desc        Get all books
// @access      Public
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route       GET /books/:user_id
// @desc        Get book by book id
// @access      Public
router.get("/:books_id", async (req, res) => {
  try {
    const book = await Book.findOne({
      customid: req.params.books_id,
    });
    console.log(req.params.books_id);

    if (!book) return res.status(400).send({ msg: "Book not Found" });

    res.json(book);
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;
