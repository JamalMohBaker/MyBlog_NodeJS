const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const moment = require('moment');

const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware - يجب أن يكون بعد تعريف app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use('/', userRoutes);


// 404 handler - يجب أن يكون في النهاية
app.use((req, res) => {
    res.status(404).render('404');
});

// Database connection and server start
mongoose.connect("mongodb+srv://firstProject:987654321@cluster0.mkiweai.mongodb.net/myBlog")
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log('❌ MongoDB connection error:', err);
    });



