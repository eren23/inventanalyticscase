const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use("/users", require("./routes/api/users"));
app.use("/books", require("./routes/api/books"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(` Server is running on port ${PORT}`));
