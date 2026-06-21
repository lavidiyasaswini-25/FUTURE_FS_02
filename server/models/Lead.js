const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true },
  phone:  { type: String, default: '' },
  source: {
    type: String,
    enum: ['Contact Form', 'LinkedIn', 'Referral', 'Email Campaign', 'Cold Outreach', 'Other'],
    default: 'Contact Form',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'lost'],
    default: 'new',
  },
  notes: [NoteSchema],
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
