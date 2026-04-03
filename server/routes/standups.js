const router = require('express').Router();
const Standup = require('../models/Standup');
const protect = require('../middleware/protect');

const today = () => new Date().toISOString().split('T')[0]; // "2025-04-02"

// submit today's standup
router.post('/', protect, async (req, res) => {
  try {
    const { did, doing, blockers } = req.body;
    if (!did || !doing) return res.status(400).json({ message: 'did and doing are required' });
    if (!req.user.teamId) return res.status(400).json({ message: 'Join a team first' });

    const standup = await Standup.create({
      userId:   req.user._id,
      teamId:   req.user.teamId,
      did, doing,
      blockers: blockers || '',
      date:     today(),
    });

    const populated = await standup.populate('userId', 'name email');
    res.status(201).json({ standup: populated });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Already submitted today' });
    res.status(500).json({ message: err.message });
  }
});

// get today's standups for my team
router.get('/team', protect, async (req, res) => {
  try {
    if (!req.user.teamId)
      return res.status(400).json({ message: 'Not in a team' });

    const standups = await Standup.find({ teamId: req.user.teamId, date: today() })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ standups, date: today() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get standup history for team (last N days)
router.get('/team/history', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    const standups = await Standup.find({
      teamId: req.user.teamId,
      date: { $gte: sinceStr },
    })
      .populate('userId', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json({ standups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;