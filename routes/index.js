const express = require('express');
const router = express.Router();
const Blog = require("../models/Blogs");


/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const allBlogs = await Blog.find({});
    res.json({
      blogs: allBlogs
    })
  }catch (e) {
    console.log(e);
  }
});

module.exports = router;
