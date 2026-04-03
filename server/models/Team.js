const mongoose = require('mongoose');
const crypto = require('crypto');

const teamSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  members:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lead:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode: { type: String, unique: true, default: () => crypto.randomBytes(3).toString('hex') },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);