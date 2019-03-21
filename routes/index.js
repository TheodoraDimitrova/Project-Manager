const express = require("express");
const router = express.Router();
const  ensureAuthenticated  = require("../config/auth");

// Welcome Page
router.get("/", (req, res) => res.render("index"));

// index
router.get("/index", ensureAuthenticated, (req, res) => {
  res.render("index", {
    user: req.user
  });
});

module.exports = router;
