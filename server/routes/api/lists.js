const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const List = require("../../models/List");

// @route   GET api/lists
// @desc    Get all lists created by the user and the lists in which he collaborates
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const userLists = await List.aggregate([
      { $match: { creator: mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          _id: 1,
          name: 1,
          taskCount: { $size: "$tasks" },
          doneCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "item",
                cond: { $eq: ["$$item.done", true] },
              },
            },
          },
        },
      },
    ]);
    const othersLists = await List.aggregate([
      {
        $match: {
          "tasks.collaborators": { $elemMatch: { _id: mongoose.Types.ObjectId(req.user.id) } },
          creator: { $not: { $eq: mongoose.Types.ObjectId(req.user.id) } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          "creator.firstname": { $arrayElemAt: ["$user.firstname", 0] },
          "creator.lastname": { $arrayElemAt: ["$user.lastname", 0] },
          totalCount: { $size: "$tasks" },
          taskCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $in: [mongoose.Types.ObjectId(req.user.id), "$$task.collaborators._id"] },
              },
            },
          },
          doneCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $and: [{ $eq: ["$$task.done", true] }, { $in: [mongoose.Types.ObjectId(req.user.id), "$$task.collaborators._id"] }] },
              },
            },
          },
        },
      },
    ]);
    res.send({ userLists, othersLists });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lists/:id
// @desc    Get list by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
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
// @access  Private
router.post("/:id/add", auth, async (req, res) => {
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
// @access  Private
router.post("/:id/rename", auth, async (req, res) => {
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
// @access  Private
router.post("/:id/:i", auth, async (req, res) => {
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

module.exports = router;
