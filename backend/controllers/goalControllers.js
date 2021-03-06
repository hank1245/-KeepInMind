const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");

const Goal = require("../models/goalModel");
const User = require("../models/userModel");

//@desc Get Goals
//route GET /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

//@desc Set Goals
//route POST /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.content) {
    res.status(400);
    throw new Error("제목과 내용을 입력해주세요");
  }
  const goal = await Goal.create({
    text: req.body.text,
    content: req.body.content,
    user: req.user.id,
  });
  res.status(200).json(goal);
});

const searchGoals = asyncHandler(async (req, res) => {
  console.log(req.body);
  const goals = await Goal.find({
    $and: [
      {
        $or: [
          { text: { $regex: `${req.body.searchVal}` } },
          { content: { $regex: `${req.body.searchVal}` } },
        ],
      },
      { user: req.user.id },
    ],
  });
  res.status(200).json(goals);
});

//@desc Update Goals
//route PUT /api/goals/:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  //Check for User
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  //because goal.user is objectId
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

//@desc Delete Goals
//route DELETE /api/goals/:id
//@access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  //because goal.user is objectId
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await goal.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
  searchGoals,
};
