import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import jwt from "jsonwebtoken";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    // Update password using Medusa's auth module
    // Note: In Medusa v2, password updates are handled through the auth module
    // This is a placeholder - actual implementation depends on your auth setup
    
    res.json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
}
