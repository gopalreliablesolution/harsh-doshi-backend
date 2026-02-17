"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function POST(req, res) {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecret");
        // Update password using Medusa's auth module
        // Note: In Medusa v2, password updates are handled through the auth module
        // This is a placeholder - actual implementation depends on your auth setup
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Reset token has expired" });
        }
        res.status(400).json({ message: "Invalid token" });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVycy9wYXNzd29yZC1yZXNldC9jb25maXJtL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0Esb0JBcUJDO0FBdkJELGdFQUErQjtBQUV4QixLQUFLLFVBQVUsSUFBSSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDaEUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBNkMsQ0FBQztJQUU5RSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLHNCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxhQUFhLENBQVEsQ0FBQztRQUVsRiw2Q0FBNkM7UUFDN0MsMkVBQTJFO1FBQzNFLDJFQUEyRTtRQUUzRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxtQkFBbUIsRUFBRSxDQUFDO1lBQ3ZDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDSCxDQUFDIn0=