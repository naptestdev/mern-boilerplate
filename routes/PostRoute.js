const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

router.get("/all", async (req, res) => {
  try {
    const existingPosts = await Post.find({});

    res.send(existingPosts);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const created = await Post.create({
      username: req.body.username,
      content: req.body.content,
    });

    res.send({
      message: "Success",
      info: created,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const existingPost = await Post.findOne({ _id: req.params.id });

    res.send(existingPost);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

module.exports = router;
