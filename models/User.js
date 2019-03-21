const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],
  profilePicture: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: ["user"]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

module.exports.getUsers = function(callback, limit) {
  User.find(callback)
    .limit(limit)
    .sort([["fName", "ascending"]]);
};
