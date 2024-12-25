import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Size = mongoose.model("Size", SizeSchema);

export default Size;
