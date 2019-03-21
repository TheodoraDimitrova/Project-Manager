const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;


module.exports.addTeam = function(team, callback) {
  Team.create(team, callback);
};

module.exports.getTeams = function(callback) {
  Team.find(callback)
    .sort([["name", "ascending"]])
    .populate("members")
    .populate("projects")
};
module.exports.addMember = function(teamId, memberId, callback) {
  Team.updateOne(
    teamId,
    {
      $push: {
        members: memberId
      }
    },
    callback
  );
};
module.exports.addProject = function(teamId, projectId, callback) {//(conditions, update, options, callback)
  Team.updateOne(
    teamId,
    {
      $push: {
        projects: projectId
      }
    },
    callback
  );
};


