const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// إعداد الجلسات
// app.use(session({
//     secret: 'your-secret-key-here', // غير هذا المفتاح
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // اجعلها true إذا كنت تستخدم HTTPS
// }));
// app.use(flash());
// Middleware - يجب أن يكون بعد تعريف app







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



