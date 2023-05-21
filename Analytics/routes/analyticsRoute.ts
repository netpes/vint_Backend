import express from "express";

const router = express.Router();

const {
  GetFeed,
  Search,
  GetFollowingFeed,
  AddAnalytics,
  MyTown,
} = require("../controllers/analyticsController");
router.post("/getfeed", GetFeed);
router.post("/addAnalytics", AddAnalytics);
router.post("/search", Search);
// router.post("/getfollowingfeed", GetFollowingFeed);
// router.post("/mytown", MyTown);

module.exports = router;
