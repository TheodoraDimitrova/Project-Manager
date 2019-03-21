const express = require("express");
const router = express.Router();
const isAdmin = require("../config/isAdmin");


const Project = require("../models/Project");
const User = require("../models/User");
const Team = require("../models/Team");

router.get("/createTeam", isAdmin, (req, res) => res.render("create-team"));
router.post("/createTeam", isAdmin, (req, res) => {
  req.checkBody("name", "Name of team is required").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    res.render("create-team", {
      errors: errors
    });
  } else {
    Team.findOne({ name: req.body.name }).then(team => {
      if (team) {
        req.flash("error_msg", "Team with that name already exists");
        res.render("create-team");
      } else {
        let team = new Team();
        team.name = req.body.name;

        Team.addTeam(team, (err, team) => {
          if (err) {
            res.send(err);
          } else {
            req.flash("success_msg", "Team is saved!");
            res.redirect("/admin/teams");
          }
        });
      }
    });
  }
});

router.get("/createProject", isAdmin, (req, res) =>
  res.render("create-project")
);
router.post("/createProject", isAdmin, (req, res) => {
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody('name', 'Name field must is too long(40) or short(5)').isLength({ min: 5, max:40 });
  req.checkBody("description", "Description is required").notEmpty();
  req.checkBody('description', 'Description field is too long(50) or short(5)').isLength({ min: 5, max:50 });
  let errors = req.validationErrors();
  if (errors) {
    res.render("create-project", {
      errors: errors
    });
  } else {
    let project = new Project();
    project.name = req.body.name;
    project.description = req.body.description;

    Project.addProject(project, (err, project) => {
      if (err) {
        res.send(err);
      }
      req.flash("success_msg", "Project saved!");
      res.redirect("/admin/projects");
    });
  }
});

router.get("/projects", isAdmin, (req, res) => {
  Project.getProjects((err, projects) => {
    if (err) {
      res.send(err);
    }
    Team.getTeams((err, teams) => {
      const pro = projects.filter(project => project.team == undefined);
      res.render("manage-projects", { projects: pro, teams: teams });
    });
  });
});
router.post("/projects", isAdmin, (req, res) => {
  req.checkBody("team", "Choose a team!").notEmpty();
  req.checkBody("project", "Choose a project!").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    Project.getProjects((err, projects) => {
      if (err) {
        res.send(err);
      }
      Team.getTeams((err, teams) => {
        res.render("manage-projects", {
          projects: projects,
          teams: teams,
          errors: errors
        });
      });
    });
  } else {
    const query = { _id: req.body.project };
    const teamId = { _id: req.body.team };
    Project.addTeam(query, req.body.team, (err, project) => {
      if (err) {
        res.send(err);
      }
      Team.addProject(teamId, req.body.project, (err, team) => {
        req.flash("success_msg", "Team added into Project!");
        res.redirect("/users/projects");
      });
    });
  }
});
router.get("/teams", isAdmin, (req, res) => {
  User.getUsers((err, users) => {
    if (err) {
      res.send(err);
    }
    Team.getTeams((err, teams) => {
      if (err) {
        res.send(err);
      }
      res.render("manage-teams", { users: users, teams: teams });
    });
  });
});

router.post("/teams", isAdmin, (req, res) => {
  req.checkBody("member", "Choose a member!").notEmpty(); //user
  req.checkBody("team", "Choose a team!").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    User.getUsers((err, users) => {
      if (err) {
        res.send(err);
      }
      Team.getTeams((err, teams) => {
        if (err) {
          res.send(err);
        }
        res.render("manage-teams", {
          users: users,
          teams: teams,
          errors: errors
        });
      });
    });
  } else {
    let teamId = req.body.team;
    Team.findOne({ _id: teamId }, function(err, team) {
      User.findOne({ _id: req.body.member }, function(err, member) {
        if (err) {
          res.send(err);
        }
      
        let memberId = req.body.member;
        let members = team.members;
        let teams=member.teams;
  
        if (members.indexOf(memberId) > -1) {
          req.flash("error_msg", "User is already in the team!");
          res.redirect("/admin/teams");
        } else {
          members.push(memberId);
          teams.push(teamId)
          member.save();
          team.save();
          req.flash("success_msg", "Member added into Team!");
          res.redirect("/users/teams");
        }
      });
    });
  }
});
module.exports = router;
