const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { registerWithoutOTP } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/registerWithoutOTP", registerWithoutOTP);
router.post("/login", login);

module.exports = router;
