const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: 
    {
      type: String,
      required: true,
      maxlength: 50
    }
  ,
  team: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  
});


const Project = mongoose.model("Project", ProjectSchema);



module.exports = Project;
module.exports.getProjects = function(callback, limit) {
  Project.find(callback)
  .populate("team")
    .limit(limit)
    .sort([["name", "ascending"]]);
};

module.exports.addProject = function(project, callback) {
  Project.create(project, callback);
};

module.exports.addTeam = function(projectId, teamId, callback) {
  Project.updateOne(
    projectId,
    {
      $push: {
        team: teamId
      }
    },
    callback
  );
};