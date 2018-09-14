let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new mongoose.Schema({
  name: {
    familyName: String,
    givenName: String
  },
  email: String,
  imageUrl: String,
  provider: String,
  providerData: Schema.Types.Mixed,
  lastUpdated: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  roles: [String]
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
