import mongoose from "mongoose";

const cartsColl = "carts";
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Carts = mongoose.model(cartsColl, cartSchema);
