import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    }, // Clerk එකේ තියෙන ID එක මෙතන link කරනවා
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    img: String, // User Profile Picture
    isAdmin: {
      type: Boolean,
      default: false,
    }, // Admin Dashboard access එකට
    savedHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ], // Wishlist/Favourites
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
