const Blog = require('../models/Blogs');

async function getAllBlogs(req, res) {

    //query blogs 
    try {
      const allBlogs = await Blog.find({});
      res.json({blogs: allBlogs });
    }catch(e){
      console.log(e);
    }
}

async function createOneBlog(req, res) {
    try {
      //parse out fields from POST request
      const title  = req.body.title 
      const text = req.body.text 
      const author = req.body.author
      const categories = req.body.category
      const year =  req.body.year;
  
      //pass fields to new Blog model 
      //notice how it's way more organized and does the type checking for us
      const newBlog = new Blog({
          title,
          text,
          author,
          categories,
          year
      });
  
      //save our new entry to the database 
      const savedData =  await newBlog.save();
      
      //return the successful request to the user 
      res.json({
          success: true,
          blogs: savedData
      });
  
    } catch (e) {
      console.log(typeof e);
      console.log(e);
      res.json({
        error: e.toString(),
      });
    }
  }

async function getOneBlog(req, res, next) {
    let oneBlogPost = null;
    try {
        oneBlogPost = await Blog.findById(req.params.id);
    } catch (error) {
        console.log(error);
    }
    res.json({
        sucess: true,
        oneBlog: oneBlogPost
    })
}

async function updateOneBlog(req,res){
    const entryId = req.params.id;
    try {
        await Blog.findByIdAndUpdate(entryId, req.body);
    } catch (err) {
        console.log(err);  
    }
    res.json({
        success: true,
        message: `blog entry id ${entryId} updated`
    })
}

async function deleteOneBlog(req,res){
    const entryId = req.params.id;
    try {
        await Blog.findByIdAndDelete(entryId);
    } catch (err) {
        console.log(err);
        throw err;  
    }

    res.json({
        success: true,
        message: `blog entry id ${entryId} deleted`
    })
}

module.exports = {
    createOneBlog,
    deleteOneBlog,
    getAllBlogs,
    getOneBlog,
    updateOneBlog
};