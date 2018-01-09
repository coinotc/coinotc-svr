module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  mongodb_url: 'mongodb://localhost/conduit'
};
