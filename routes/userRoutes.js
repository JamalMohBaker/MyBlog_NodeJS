const express = require("express");
const { createUser } = require("../controllers/userController");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("users/create", {
        success: null,
        error: null,
        formData: {}
    });
});
// Route to create a new user
router.post("/addusers", createUser);

module.exports = router;