const User = require("../models/user");

// Controller function to create a new user 
exports.createUser = async (req, res) => {
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