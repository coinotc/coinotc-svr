module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  //mongodb_url: 'mongodb://root:123456@ds239217.mlab.com:39217/coinotc'
  mongodb_url: 'mongodb://localhost/coinotc'
};
