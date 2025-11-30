const Post = require('../models/Post');
const moment = require('moment');
// const { post } = require('../routes/postRoutes');

// exports.index = (req, res) => {
//     res.render('posts/index');
// };
exports.index = async (req,res) =>{
    try{
        const userId = req.user._id; 
        const posts = await Post.find()
            .populate('author')
            .where('author').equals(userId);
        res.render('posts/index',{
            posts:posts,
            moment:moment,
        })
    }catch(err){
        console.log(err);
        res.render('404');
    }
}
exports.createPost = (req, res) => {
    res.render('posts/create', {
        success: null,
        error: null
    });
}

exports.storePost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: "✅ Post created successfully!",
                post: newPost
            });
        }

        res.render('posts/create', {
            success: "✅ User created successfully!",
            error: null,
            formData: {}
        });

    } catch (err) {
        // للطلب Ajax
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: false,
                message: "❌ " + err.message
            });
        }

        res.render('posts/create', {
            error: "❌ " + err.message,
            success: null,
            formData: req.body
        });
    }
};
exports.editPost = async (req,res) => {
    try{
        const userId = req.user._id; 
        const post = await Post.findById(req.params.id)
            .populate('author')
            .where('author').equals(userId);
        if (!post) {
            return res.status(404).render('404');
        }
        res.render('posts/edit',{
            post:post
        })
    }catch(err){
        console.log(err);
        res.redirect('404');
    }
}

exports.updatePost = async (req,res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: "✅ User created successfully!",
                post: post
            });
        }
        // req.flash('success', 'User updated successfully');
        res.redirect('/admin/posts');
    }catch(err){
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // req.flash('error', 'Failed to update user: ' + err.message);
        res.redirect(`/admin/posts/editPost/${req.params.id}`);
    }
    
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) { 
            if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }
            return res.redirect('/admin/posts?error=User not found');
        }
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: 'Post deleted successfully'
            });
        }
        res.redirect('/admin/posts?success=Post deleted successfully');
    } catch (err) {
        console.log(err);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete post'
            });
        }
        res.redirect('/admin/posts?error=Failed to delete user');
    }
}