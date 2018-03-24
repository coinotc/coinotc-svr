var router = require('express').Router();

router.use('/', require('./users'));
router.use('/order', require('./make-order'));
router.use('/guanggao', require('./ad'));
router.use('/admin-dashboard', require('./admin-dashboard'));
router.use('/complain', require('./complain'));
router.use('/advertisement', require('./advertisement'));
router.use('/wallet', require('./crypto-wallet'));
router.use('/base-currency', require('./users'));
router.use('/alert', require('./alert'));
router.use('/sendmail', require('./sendmail'));
router.use('/upload', require('./upload'));
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
// router.use(function(error, request, response, next) {
//   console.log("ITCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
//   response.header("Access-Control-Allow-Origin", "http://localhost:4200");
//   response.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//   response.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
//   response.header("Access-Control-Allow-Credentials", "true");
//   next();

//   return next(error);
// });

module.exports = router;
