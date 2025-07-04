import mongoose from "mongoose";

const MovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    from: {
      warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
      category: { type: String, default: null },
      subcategory: { type: String, default: null },
    },
    to: {
      warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
      category: { type: String, default: null },
      subcategory: { type: String, default: null },
    },
    type: {
      type: String,
      required: true,
      enum: ["transfer", "adjustment", "write-off"],
    },
  },
  { timestamps: true }
);

const Movement = mongoose.model("Movement", MovementSchema);

export default Movement;
