var router = require('express').Router();

router.use('/', require('./users'));
router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));
router.use('/order',require('./make-order'));
router.use('/guanggao',require('./ad'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;