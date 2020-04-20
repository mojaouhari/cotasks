const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const List = require("../../models/List");

// @route   GET api/lists
// @desc    Get all lists created by the user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const list = await List.find({ creator: req.user.id });
    res.send(list);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lists/:id
// @desc    Get list by id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });
    else return res.status(200).send(list);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") return res.status(404).json({ message: "List not found" });
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists
// @desc    Create a list
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const newList = new List({ ...req.body, creator: req.user.id });
    const list = await newList.save();
    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists/:id/add
// @desc    Add task to list
// @access  Public
router.post("/:id/add", async (req, res) => {
  try {
    const task = req.body.task;
    const list = await List.updateOne(
      { _id: req.params.id },
      {
        $push: {
          tasks: task,
        },
      }
    );
    if (!list) return res.status(404).json({ message: "List not found" });
    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists/:id/rename
// @desc    Rename list
// @access  Public
router.post("/:id/rename", async (req, res) => {
  // TODO test if this works
  try {
    const name = req.body.name;
    const list = await List.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: name,
        },
      }
    );
    if (!list) return res.status(404).json({ message: "List not found" });
    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists/:id/:i
// @desc    Update a task in a list
// @access  Public
router.post("/:id/:i", async (req, res) => {
  try {
    const task = req.body.task;
    const list = await List.updateOne(
      { _id: req.params.id },
      {
        $set: {
          [`tasks.${req.params.i}`]: task,
        },
      }
    );
    if (!list) return res.status(404).json({ message: "List not found" });
    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// TODO make the routes private !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

module.exports = router;
