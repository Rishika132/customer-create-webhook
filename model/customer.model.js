const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  tags: { type: [String], default: [] },
  store_name: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
