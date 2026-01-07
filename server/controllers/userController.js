import User from "../models/User.js";

// 1. User Login වෙනකොට Data Sync කරන එක (කලින් තිබුන එක)
export const saveUser = async (req, res) => {
  const { clerkId, email, firstName, lastName, photo } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: clerkId },
      {
        clerkId,
        email,
        firstName,
        lastName,
        photo,
      },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. User Dashboard එකට ආවාම විස්තර ගන්න Function එක (Get User Profile)
export const getUserProfile = async (req, res) => {
  const { clerkId } = req.params;
  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. User Dashboard එකෙන් විස්තර Update කරන Function එක
export const updateUserProfile = async (req, res) => {
  const { clerkId, phone, address, country, firstName, lastName } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { phone, address, country, firstName, lastName },
      { new: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
