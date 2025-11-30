const mongoose = require('mongoose'); 
const User = require("../models/user");
const moment = require("moment");

exports.index = (req, res) => { 
    res.render("index");
};

exports.getAllUsers = async (req,res) =>{
    try{
        const users = await User.find();
        res.render('users/index',{
            users:users,
            moment:moment,
            success:null,
            error:null
        })
    }catch(err){
        console.log(err);
    }
}
exports.createUser = (req, res) => {
    res.render("users/create", {
        success: null,
        error: null,
        formData: {}
    });
}      
// Controller function to create a new user 
exports.storeUser = async (req, res) => {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        // هذا السطر يحدد إذا كان الطلب Ajax أو لا
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: "✅ User created successfully!",
                user: newUser
            });
        }

        res.render('users/create', {
            success: "✅ User created successfully!",
            error: null,
            formData: {}
        });

    } catch (err) {    
        // للطلب Ajax
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(400).json({
                success: false,
                message: "❌ " + err.message
            });
        }

        res.render('users/create', {
            error: "❌ " + err.message,
            success: null,
            formData: req.body
        });
    }
};
exports.editUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
       
        res.render('users/edit',{
            user:user
        })
    }catch(err){
        console.log(err);
        res.redirect('/admin/users/allusers');
    }
}
exports.updateUser = async (req,res) => {
    try{
        const user = await  User.findByIdAndUpdate(req.params.id,req.body,{
            new:true,runValidators:true
        }); 
        
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: "✅ User created successfully!",
                user: user
            });
        }    
        // req.flash('success', 'User updated successfully');
        res.redirect('/admin/allusers');
        }catch(err){
        console.log(err);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(400).json({
                success: false,
                message: "❌ or  Password and confirmation do not match" + err.message
            });
        }
        // req.flash('error', 'Failed to update user: ' + err.message);
        res.redirect(`/admin/editUser/${req.params.id}`);
    }
}   

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) { 
            if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            return res.redirect('/admin/allusers?error=User not found');
        }
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        res.redirect('/admin/allusers?success=User deleted successfully');
    } catch (err) {
        console.log(err);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
        res.redirect('/admin/allusers?error=Failed to delete user');
    }
}