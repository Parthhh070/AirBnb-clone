if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const ExpressError = require("./utils/expressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const DB_URL = process.env.ATLASDB_URL;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in session store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

async function main() {
  await mongoose.connect(DB_URL);
}

main().catch((err) => console.log(err));
main().then(() => {
  console.log("connected to DB");
});

app.listen(port, () => {
  console.log("listening on ", port);
});

//session connection

app.use(session(sessionOptions));
app.use(flash());

//authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//listing router

app.use("/listings", listingRouter);

//review router

app.use("/listings/:id/reviews", reviewRouter);

//user router

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

//error handler

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});
