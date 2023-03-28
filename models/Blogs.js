const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const blogSchema = new mongoose.Schema({
    title: String,
    text: String,
    author: String,
    categories: [String],
    _id: {type: String, default: uuid4},
    createdAt: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
});

//register model to collection
const Blog = mongoose.model("sample_Blogs", blogSchema);

//make out model accesible to files
module.exports = Blog;