const express = require("express");
const cors = require("cors");
const blogRouter = require("./route/blog-route");
require("./db");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);

app.use("/api", (req, res) => {
  res.send("Hello World");
});
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

app.listen(5000, () => console.log(`APP is running at 5000...`));
