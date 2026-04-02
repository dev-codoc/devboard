const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  teamId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  role:         { type: String, enum: ['member', 'lead'], default: 'member' },
}, { timestamps: true });

userSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);