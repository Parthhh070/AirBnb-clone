const { reviewSchema } = require("../schema.js");
const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

//review creation

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
