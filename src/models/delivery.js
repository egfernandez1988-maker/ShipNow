const mongoose = require("mongoose");
const { DELIVERY_STATUSES } = require('../constants');

// Modelo de Delivery (entrega: vincula un Order con un Courier).
const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: "Courier" },
  status: {
    type: String,
    enum: Object.values(DELIVERY_STATUSES),
    default: DELIVERY_STATUSES.ASSIGNED,
  },
  assignedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", deliverySchema);
