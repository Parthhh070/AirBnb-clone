const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.login(regUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginUSerForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", `welcome back, ${req.body.username}`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};


module.exports.logOut =  async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next();
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
}