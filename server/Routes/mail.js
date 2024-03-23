const express = require("express");
const { emailService } = require("../Controllers/mailController.js");

const router = express.Router();

router.post("/mail", emailService);

module.exports = router;
