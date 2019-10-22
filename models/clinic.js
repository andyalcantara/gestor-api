const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicSchema = new Schema({
    name: { type: String, required: true},
    pay: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    labCosts: [{ type: String }]
});

module.exports = mongoose.model('Clinic', clinicSchema);
