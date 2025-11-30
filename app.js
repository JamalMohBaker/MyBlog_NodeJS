require('dotenv').config();
const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const userRoutes = require('./routes/userRoutes');
const AuthRoutes = require('./routes/auth');
const PostRoutes = require('./routes/postRoutes');
const app = express();
const port = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;
const { auth } = require('./middleware/auth');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



// Auth Middleware
const { userContext } = require('./middleware/auth');
const { index } = require('./controllers/userController');




app.use(userContext);
app.use('/admin/users', userRoutes);
app.use('/admin/posts', PostRoutes);
// app.use('/', userRoutes);
app.use('/',AuthRoutes);
app.use('/',auth,index);
// 
// 404 handler - يجب أن يكون في النهاية
app.use((req, res) => {
    res.status(404).render('404');
});

// Database connection and server start
mongoose.connect(DATABASE_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log('❌ MongoDB connection error:', err);
    });



