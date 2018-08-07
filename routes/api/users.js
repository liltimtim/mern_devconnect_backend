const express = require("express");
const router = express.Router();

router.get("/test", (req, res) =>
  res.json({
    msg: "user"
  })
);
router.get("/test", (req, res) => res.json({ msg: "user" }));
module.exports = router;
