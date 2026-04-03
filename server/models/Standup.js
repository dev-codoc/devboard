const mongoose = require('mongoose');

const standupSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  did:      { type: String, required: true },
  doing:    { type: String, required: true },
  blockers: { type: String, default: '' },
  date:     { type: String, required: true }, // "YYYY-MM-DD" — easy to query by day
}, { timestamps: true });

// one standup per user per day
standupSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Standup', standupSchema);