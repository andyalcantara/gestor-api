const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatSchema = new Schema({
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic' },
    user: { type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Treatment', treatSchema);

