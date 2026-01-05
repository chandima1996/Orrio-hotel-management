import User from "../models/User.js";

// Frontend එකෙන් එන User Data Database එකට දාන function එක
export const saveUser = async (req, res) => {
  const { clerkId, email, firstName, lastName, photo } = req.body;

  try {
    // අපි බලනවා මේ User කලින් ඉන්නවද කියලා.
    // ඉන්නවා නම් Update කරනවා, නැත්නම් අලුතෙන් හදනවා (upsert: true).
    const user = await User.findOneAndUpdate(
      { clerkId: clerkId },
      {
        clerkId,
        email,
        firstName,
        lastName,
        photo,
      },
      { new: true, upsert: true } // upsert: true නිසා User නැත්නම් අලුතෙන් හැදෙනවා
    );

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
