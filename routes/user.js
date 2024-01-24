const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const user = require("../models/user.js");

router
  .route("/signup")
  .get(userController.signUpForm)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.loginUSerForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logOut);

module.exports = router;
