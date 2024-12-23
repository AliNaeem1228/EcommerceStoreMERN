import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
