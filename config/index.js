module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SESSION_SECRET : 'asdsfdsfdR##@$#@#$@dr32423',
  mongodb_url: 'mongodb://localhost/coinotc'
};
