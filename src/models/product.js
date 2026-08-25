const mongoose = require("mongoose");
const { PRODUCT_STATUSES } = require("../constants");

// Modelo de Product (producto del catalogo).
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUSES),
    default: PRODUCT_STATUSES.AVAILABLE,
  },
});

module.exports = mongoose.model("Product", productSchema);
