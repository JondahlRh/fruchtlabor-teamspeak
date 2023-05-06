const express = require("express");
const {
  signup,
  login,
  edit,
  list,
} = require("../controllers/users-controllers");
const { check } = require("express-validator");
const checkPermission = require("../middleware/check-permission");

const router = express.Router();

router.get("/", checkPermission("users-list"), list);
router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    try {
      await signup(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/edit", async (req, res, next) => {
  try {
    await checkPermission(req, res, next, "users-edit");
    await edit(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
