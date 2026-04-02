const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb://localhost:27017/myhab');
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
