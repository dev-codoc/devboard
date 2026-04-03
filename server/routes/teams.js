const router = require('express').Router();
const Team = require('../models/Team');
const User = require('../models/User');
const protect = require('../middleware/protect');

// create a new team
router.post('/create', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Team name required' });

    const team = await Team.create({ name, lead: req.user._id, members: [req.user._id] });
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id, role: 'lead' });

    res.status(201).json({ team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// join via invite code
router.post('/join/:inviteCode', protect, async (req, res) => {
  try {
    const team = await Team.findOne({ inviteCode: req.params.inviteCode });
    if (!team) return res.status(404).json({ message: 'Invalid invite code' });

    const alreadyIn = team.members.includes(req.user._id);
    if (alreadyIn) return res.status(400).json({ message: 'Already in this team' });

    team.members.push(req.user._id);
    await team.save();
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get my team info
router.get('/me', protect, async (req, res) => {
  try {
    if (!req.user.teamId)
      return res.status(404).json({ message: 'Not in a team yet' });

    const team = await Team.findById(req.user.teamId)
      .populate('members', 'name email role')
      .populate('lead', 'name email');

    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;