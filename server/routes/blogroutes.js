const express = require("express");
const {
  addNewBlog,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  getBlogsByStatusController
} = require("../controllers/blogcontroller");

const router = express.Router();

router.post("/blogs", addNewBlog);
router.get("/blogs", getAllBlogsController);
router.get("/blogs/status/:status", getBlogsByStatusController);
router.get("/blogs/:id", getBlogByIdController);
router.put("/blogs/:id", updateBlogController);
router.delete("/blogs/:id", deleteBlogController);

module.exports = router;