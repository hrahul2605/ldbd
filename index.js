const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const urlModel = require("./model/url");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shurl";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected.");
  })
  .catch(() => console.log("DB Connection Failed."));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));

app.use(express.static("public"));

app.get("/:slug", async (req, res) => {
  const url = await urlModel.findOne({ slug: req.body.slug });
  if (!url) {
    res.status(404);
    res.json({ message: "URL not found." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
