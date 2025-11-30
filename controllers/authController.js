const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

exports.showRegister = (req, res) => {
    res.render('auth/register', {
        title: '  Create an Account',
    });
};

exports.register = async (req, res) => {
    try {
        if (!req.xhr && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
            return res.redirect('/register');
        }

        const { firstName, lastName, email, gender,password, confirmPassword } = req.body;
        if (!firstName || !lastName || !email || !gender || !password) {
            return res.json({
                success: false,
                message: ' All fields are required '
            });
        }
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: '  Passwords do not match '
            });
        }
        // if (password !== confirmPassword) {
        //     // تحتاج إضافة flash messages
        //     return res.redirect('/register?error=password_mismatch');
        // }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'Email already in use '
            });
            
        }

        const user = new User({ firstName, lastName, gender, email, password });
        await user.save();

        res.json({
            success: true,
            message: 'Account created successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            message: '  Server error. Please try again later. '
        });
        // res.redirect('/register?error=server_error');
    }
};

exports.showLogin = (req, res) => {
    // استقبال رسائل الخطأ من query parameters
    const error = req.query.error;
    const success = req.query.success;

    res.render('auth/login', {
        title: 'تسجيل الدخول',
        error,
        success
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. البحث عن المستخدم
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.redirect('/login?error=invalid_credentials');
        }

        // 2. التحقق من كلمة المرور
        
        const isMatch = await user.comparePassword(password, user.password);
      

        if (!isMatch) {
            return res.redirect('/login?error=Password_incorrect');
        }

        // 3. إنشاء التوكن
        const token = generateToken(user._id);

        // 4. حفظ التوكن
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        if(user.type==='admin'){
            return res.redirect('/admin/users/allusers');
        }else{
             return res.redirect('/?success=login_success');
        }
       

    } catch (error) {
        return res.redirect('/login?error=server_error');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};