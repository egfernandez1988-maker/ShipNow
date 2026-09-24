const mongoose = require("mongoose");
const { ORDER_STATUSES, ORDER_PRIORITIES } = require('../constants');

// Modelo de Order (envio/pedido).
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true }, // se mantiene del v1 original
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  weight: { type: Number, required: true },
  cost: { type: Number },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUSES),
    default: ORDER_STATUSES.PENDING,
  },
  priority: {
    type: String,
    enum: Object.values(ORDER_PRIORITIES),
    default: ORDER_PRIORITIES.NORMAL,
  },
  items: [
    {
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    },
  ],
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: "Courier" },
});

module.exports = mongoose.model("Order", orderSchema);
