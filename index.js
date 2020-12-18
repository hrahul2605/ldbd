const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { nanoid } = require("nanoid");
const Joi = require("joi");
const urlModel = require("./model/url");

// .env config
require("dotenv").config();

// BodyValidation
const bodySchema = Joi.object({
  url: Joi.string().uri().required(),
  slug: Joi.string()
    .length(7)
    .regex(/[\w\-]/i),
});

// PORT
const PORT = process.env.PORT || 3000;

// MONGO_URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ldbd";

// DOMAIN NAME
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/`;

// Mongo Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
  })
  .then(() => {
    console.log("DB Connected.");
  })
  .catch(() => console.log("DB Connection Failed."));

// App initialise
const app = express();

// BodyParsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use(morgan("tiny"));

// Serve static file
app.use(express.static("public"));

// ShortURL Endpoint
app.get("/:slug", async (req, res) => {
  const url = await urlModel.findOne({ slug: req.params.slug });
  if (!url) {
    res.status(404);
    res.json({ message: "URL not found." });
  }

  res.redirect(url.url);
});

// ShortURL Create Endpoint
app.post("/create", async (req, res) => {
  try {
    const { error, val } = bodySchema.validate(req.body);
    console.log(error);
    if (error) {
      res.status(404);
      res.json({
        message:
          error.details[0].path[0] === "url"
            ? "URL required."
            : "Slug format wrong.",
      });
      return;
    }

    let slug = req.body.slug;
    if (!slug) {
      slug = nanoid(7);
    }

    const found = await urlModel.findOne({ slug: slug });

    if (found) {
      res.status(409);
      res.send({ message: "Slug Already Exists." });
      return;
    }

    const created = await urlModel.create({ url: req.body.url, slug: slug });
    res.send({ shortURL: `${BASE_URL}${created.slug}` });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
