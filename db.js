const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);

const db = {
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        'mongodb://localhost/sonect-demo',
        { useNewUrlParser: true }
      );
      const { connection } = mongoose;
      connection.on('error', reject);
      connection.once('open', resolve);
    });
  }
};

module.exports = db;
