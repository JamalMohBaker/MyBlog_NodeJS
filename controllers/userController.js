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
        // res.status(201).json({
        //     success: true,
        //     message: "User created successfully",
        //     user: newUser
        // });  
        res.render('users/create', {
            success: "✅ User created successfully!",
            error: null,
            formData: {}
        });
    } catch (err) {    
        // res.status(400).json({
        //     success: false,
        //     message: err.message
        // }); 
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
    }
}
exports.updateUser = async (req,res) => {
    try{
        const user = await  User.findByIdAndUpdate(req.params.id,req.body,{
            new:true,runValidators:true
        });       
        // req.flash('success', 'User updated successfully');
        res.redirect('/admin/allusers');
        }catch(err){
        console.log(err);
        // req.flash('error', 'Failed to update user: ' + err.message);
        res.redirect(`/admin/editUser/${req.params.id}`);
    }
}   

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) { 
            return res.redirect('/admin/allusers?error=User not found');
        }
        res.redirect('/admin/allusers?success=User deleted successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/allusers?error=Failed to delete user');
    }
}