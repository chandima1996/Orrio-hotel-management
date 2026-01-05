import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true, // Clerk ID එක ඩොප්ලිකේට් වෙන්න බෑ
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    photo: {
      type: String, // User ගේ Profile Picture එක
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } // createAt, updatedAt ඉබේම හැදෙනවා
);

const User = mongoose.model("User", userSchema);

export default User;
