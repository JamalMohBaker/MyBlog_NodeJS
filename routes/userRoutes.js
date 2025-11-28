const express = require("express");
const { createUser, getAllUsers, storeUser, index, editUser, updateUser, deleteUser } = require("../controllers/userController");
const User = require("../models/user");
const passwordValidator = require("../middleware/passwordValidator");
const { auth } = require("../middleware/auth");
// const user = require("../models/user");

const router = express.Router();

router.get("/", index);
// Route to create a new user
router.get("/allusers",auth,getAllUsers);
router.get("/addUsers",auth,createUser);
router.post("/storeUsers", auth, storeUser);
router.get("/editUser/:id", auth, editUser);
router.put("/updateUser/:id", auth, passwordValidator,updateUser);
router.delete("/deleteUser/:id", auth, deleteUser);
module.exports = router;