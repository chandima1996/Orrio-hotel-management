import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

// මේකෙන් තමයි අපි check කරන්නේ user log වෙලාද ඉන්නේ කියලා backend එකෙන්
export const requireAuth = ClerkExpressRequireAuth({
  // ඔයාගේ Error handling මෙතනට දාන්න පුළුවන්
  onError: (err, req, res) => {
    res.status(401).json({ error: "Unauthenticated: Please log in" });
  },
});
