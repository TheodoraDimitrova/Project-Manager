const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const  ensureAuthenticated  = require("../config/auth");
// Load User model
const User = require("../models/User");
const Project = require("../models/Project");
const Team = require("../models/Team");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register

router.post("/register", (req, res) => {
  if (req.body.profilePicture === "") {
    req.body.profilePicture =
      "https://png.pngtree.com/svg/20161110/d3396c299f.svg";
  }
  const { lName, fName, email, password, profilePicture } = req.body;
  let errors = [];

  if (!fName || !lName || !password || !email) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      fName,
      email,
      lName,
      password,
      profilePicture
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          fName,
          email,
          lName,
          password,
          profilePicture
        });
      } else {
        const newUser = new User({
          fName,
          email,
          lName,
          password,
          profilePicture
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;

            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});





router.get("/profile", ensureAuthenticated, (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({ path: "teams", populate: { path: "projects" } })
    .exec((err, user) => {
      let namesProjects = [];
      let teamsProjects = user.teams;
      teamsProjects.forEach(team => {
        let projectsByTeam = team.projects;
        projectsByTeam.forEach(project => {
          namesProjects.push(project.name);
        });
      });

      res.render("profile", { user: user, projects: namesProjects });
    });
});

router.get("/projects", ensureAuthenticated, (req, res, next) => {
  Project.getProjects((err, projects) => {
    if (err) {
      res.send(err);
    }
    res.render("projects_user", { user: req.user, projects: projects });
  });
});

router.get("/teams", ensureAuthenticated, (req, res, next) => {
  Team.getTeams((err, teams) => {
    if (err) {
      res.send(err);
    }
    res.render("teams_users", { user: req.user, teams: teams });
  });
});
router.post("/leave/:id", ensureAuthenticated, (req, res, next) => {
  Team.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { members: req.user._id } },
    (err, team) => {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { teams: req.params.id } },
        (err, user) => {
          if (err) {
            console.log(err);
            return res.send(err);
          }
          res.redirect("/users/profile");
        }
      );
    }
  );
});

router.post("/teams/search", ensureAuthenticated, (req, res, next) => {
  let searchVal = req.body.search;
  let matchedTeams = [];
  Team.getTeams((err, teams) => {
    if (err) {
      res.send(err);
    }
    for (let index = 0; index < teams.length; index++) {
      const element = teams[index].name;
      if (element.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
        matchedTeams.push(teams[index]);
      }
    }
    res.render("teams_users", { user: req.user, teams: matchedTeams });
  });
});

router.post("/projects/search", ensureAuthenticated, (req, res, next) => {
  let searchVal = req.body.search;

  let matchedProjects = [];
  Project.getProjects((err, projects) => {
    if (err) {
      res.send(err);
    }
   
    for (let index = 0; index < projects.length; index++) {
      const element = projects[index].name;
      if (element.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
        matchedProjects.push(projects[index]);
      }
    }
    res.render("projects_user", { user: req.user, projects: matchedProjects });
  });
});


module.exports = router;
