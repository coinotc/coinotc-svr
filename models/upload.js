var mongoose = require('mongoose');
module.exports = mongoose.model('upload', {
     img: 
        { data: Buffer, contentType: String }
    
  });