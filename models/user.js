// const express = require("express");
// const { min } = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [30, 'First name must be at most 30 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
        
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select:false
    },
    phone: {
        type: String,
        // required: [true, 'phone number is required'] 
    },
    age: Number,
    country: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required']
    },
    type: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inActive'],
        default: 'active'
    },
    img: String,
},{timestamps:true});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// مقارنة كلمات المرور
userSchema.methods.comparePassword = async function (candidatePassword,passwordDB) {
    try {
    
        if (!candidatePassword || !this.password) {
            console.log('❌ Missing data for comparison');
            return false;
        }
        passwordLogin = await bcrypt.hash(candidatePassword, 12);
        const result = await bcrypt.compare(candidatePassword, passwordDB);
        console.log('   Comparison result:', result);
        return result;

    } catch (error) {
        console.error('💥 Comparison error:', error.message);
        return false;
    }
};
module.exports = mongoose.model('User', userSchema);