const express = require("express");
const router = express.Router();
const Image = require("../models/Images.model.js");

router.post("/image/:userId", async (req, res) => {
  try {
    const { image, prompt } = req.body;

    Image.create({ userId: req.params.userId, image: image, prompt });

    res.status(200).json({ msg: "Image stored successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/image/:userId", async (req, res) => {
  try {
    // const Apikey = req.params.Apikey
    const images = await Image.find({ userId: req.params.userId });
    res.status(200).json(images);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
