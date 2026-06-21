const router = require('express').Router();
const Lead   = require('../models/Lead');
const auth   = require('../middleware/authMiddleware');

// GET /api/leads — get all leads (protected)
router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { source:{ $regex: search, $options: 'i' } },
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leads — create lead (public — from contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: 'Name and email are required' });
    const lead = await Lead.create({ name, email, phone, source });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leads/:id — get single lead (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/leads/:id/status — update status (protected)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leads/:id/notes — add note (protected)
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes.push({ text: req.body.text });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/leads/:id — delete lead (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
