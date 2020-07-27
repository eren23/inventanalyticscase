const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect to our db finally
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API Running");
});

//Define routes
app.use("/api/users", require("./routes/api/users"));
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/profile", require("./routes/api/profiles"));
app.use("/api/books", require("./routes/api/books"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(` Server is running on port ${PORT}`));
