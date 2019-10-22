const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let invoiceSchema = new Schema({
   clinic: { type: Schema.Types.ObjectId, ref: 'Clinic' },
   user: { type: Schema.Types.ObjectId, ref: 'User'},
   date: { type: Date, default: Date.now },
   clinicHistory: { type: String },
   name: { type: String, required: true },
   treatments: [{ type: String, required: true }],
   price: { type: String, required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
