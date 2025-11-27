const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};


    // requireAdmin للتحقق من الصلاحيات
    // const requireAdmin = (req, res, next) => {
    //     if (!req.user || req.user.type !== 'admin') {
    //         req.flash('error', 'ليس لديك صلاحية للوصول لهذه الصفحة');
    //         return res.redirect('/');
    //     }
    //     next();
    // };
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            // req.flash('error', 'يجب تسجيل الدخول أولاً');
            return res.redirect('/login?error=auth_required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            // req.flash('error', 'المستخدم غير موجود');
            return res.redirect('/login?error=user_not_found');
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        // req.flash('error', 'خطأ في المصادقة');
        return res.redirect('/login?error=auth_failed');
    }
};

// 🔹 Guest Middleware - لازم يكون مش مسجل دخول
const guest = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                // req.flash('info', 'أنت مسجل دخول بالفعل');
                return res.redirect('/dashboard?error=already_logged_in');
            }
        }

        next();

    } catch (error) {
        // إذا كان التوكن خاطئ، خلينا نكمل كضيف
        next();
    }
};

// 🔹 Middleware لتحديد حالة اليوزر فقط (بدون redirect)
const userContext = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            
            if(user){
               req.user = user; 
                res.locals.user = user; 
            } else {
                req.user = null;
                res.locals.user = null;
            }

        } else {
            req.user = null;
            res.locals.user = null;
        }

        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

module.exports = {
    generateToken,
    auth,
    guest,
    userContext
    // requireAdmin
};