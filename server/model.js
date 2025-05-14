const mongoose = require("mongoose");

let journalSchema = new mongoose.Schema({
  username: { type: String },
  sobrietyDate: { type: Date },
  entryDate: { type: Date },
  feeling: { type: String },
  cravingLevel: { type: Number },
  journalEntry: { type: String },
});

const Journal = mongoose.model('journal', journalSchema);

module.exports = Journal;