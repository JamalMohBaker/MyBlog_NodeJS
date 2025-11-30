const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Route to create a new post
router.get("/", postController.index);
router.get("/addPost", postController.createPost);
router.post("/storePost", postController.storePost);
router.get("/editPost/:id", postController.editPost);
router.put("/updatePost/:id", postController.updatePost);
router.delete("/deletePost/:id", postController.deletePost);


module.exports = router;