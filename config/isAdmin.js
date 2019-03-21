module.exports = (req, res, next)=> {
    if (req.user && req.user.role === "admin"){
      return next();
    }
    else{
      req.flash("error", "You are not admin to view that page");
      res.redirect("/users/login");
    } 
  };