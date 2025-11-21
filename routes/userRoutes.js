const express = require("express");
const { createUser, getAllUsers, storeUser, index, editUser, updateUser, deleteUser } = require("../controllers/userController");
const User = require("../models/user");
const passwordValidator = require("../middleware/passwordValidator");
// const user = require("../models/user");

const router = express.Router();

router.get("/", index);
// Route to create a new user
router.get("/admin/allusers",getAllUsers);
router.get("/addUsers",createUser);
router.post("/storeUsers",storeUser);
router.get("/admin/editUser/:id",editUser);
router.put("/admin/updateUser/:id",passwordValidator,updateUser);
router.delete("/admin/deleteUser/:id", deleteUser);
module.exports = router;