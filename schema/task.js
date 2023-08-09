const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    task: {
      type: String,
      required: true,
    },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true }
  });

const model = mongoose.model('Tasks', TaskSchema)

module.exports = model;