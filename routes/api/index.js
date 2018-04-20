var router = require('express').Router();

router.use('/', require('./users'));
router.use('/order', require('./order'));
router.use('/admin-dashboard', require('./admin-dashboard'));
router.use('/complain', require('./complain'));
router.use('/advertisement', require('./advertisement'));
router.use('/wallet', require('./wallets'));
router.use('/base-currency', require('./users'));
router.use('/alert', require('./alert'));
router.use('/upload', require('./upload'));
router.use('/2fa', require('./2fa'));
router.use('/background', require('./BackgroundUser'));

router.use(function(err, req, res, next) {
  console.log('error has occurred!');
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
