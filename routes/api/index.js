var router = require('express').Router();

router.use('/', require('./users'));
router.use('/order', require('./make-order'));
router.use('/admin-dashboard', require('./admin-dashboard'));
router.use('/complain', require('./complain'));
router.use('/advertisement', require('./advertisement'));
router.use('/wallet', require('./crypto-wallet'));
router.use('/base-currency', require('./users'));
router.use('/alert', require('./alert'));
router.use('/sendmail', require('./sendmail'));
router.use('/2fa', require('./2fa'));
router.use('/background', require('./BackgroundUser'));
router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
