const { Router } = require("express");
const usersController = require("../controllers/users");
const checkPermission = require("../middleware/check-permission");
const { check } = require("express-validator");
const errorHandler = require("../utility/errorHandler");

const router = Router();

router.get(
  "/",
  checkPermission("users-get"),
  errorHandler(usersController.getUsers)
);
router.patch(
  "/",
  checkPermission("users-patch"),
  errorHandler(usersController.patchUsers)
);

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  errorHandler(usersController.postSignup)
);
router.post("/login", errorHandler(usersController.postLogin));

module.exports = router;
