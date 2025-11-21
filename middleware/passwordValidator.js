module.exports = function passwordValidator(req, res, next) {
    const { password, confirmPassword } = req.body;

    // إذا قدم كلمة مرور، تحقق من التأكيد
    if (password && password.trim() !== '') {
        if (!confirmPassword || confirmPassword.trim() === '') {
            return res.render('users/edit', {
                user: req.body,
                error: 'Password confirmation is required'
            });
        }

        if (password !== confirmPassword) {
            return res.render('users/edit', {
                user: req.body,
                error: 'Passwords do not match'
            });
        }
    } else {
        // إذا كلمة المرور فارغة، احذفها من req.body
        delete req.body.password;
        delete req.body.confirmPassword;
    }

    next();
}