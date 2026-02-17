"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const utils_1 = require("@medusajs/framework/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
async function POST(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
    try {
        const customers = await customerService.listCustomers({ email });
        if (customers.length === 0) {
            return res.json({ message: "If email exists, reset link will be sent" });
        }
        const customer = customers[0];
        const token = jsonwebtoken_1.default.sign({ customer_id: customer.id, email: customer.email }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });
        const resetUrl = `${process.env.STORE_CORS?.split(',')[0]}/reset-password.html?token=${token}`;
        // Check if email sending is enabled
        const emailEnabled = process.env.EMAIL_ENABLED === 'true' || process.env.EMAIL_ENABLED === 'on';
        if (!emailEnabled) {
            console.log('Email sending is disabled. Skipping password reset email.');
            console.log('Reset URL would be:', resetUrl); // Log for debugging when disabled
            return res.json({ message: "If email exists, reset link will be sent" });
        }
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.SMTP_FROM || "noreply@harssh-doshi.com",
            to: email,
            subject: "Password Reset Request",
            html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
        });
        res.json({ message: "If email exists, reset link will be sent" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to process request", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVycy9wYXNzd29yZC1yZXNldC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQU1BLG9CQTREQztBQWhFRCxxREFBb0Q7QUFDcEQsZ0VBQStCO0FBQy9CLDREQUFvQztBQUU3QixLQUFLLFVBQVUsSUFBSSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDaEUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUEwQixDQUFDO0lBRWpELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNYLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxNQUFNLGVBQWUsR0FBMkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXBGLElBQUksQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFakUsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxDQUFDLENBQUM7UUFDM0UsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLEtBQUssR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FDcEIsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxhQUFhLEVBQ3ZDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUNwQixDQUFDO1FBRUYsTUFBTSxRQUFRLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixLQUFLLEVBQUUsQ0FBQztRQUUvRixvQ0FBb0M7UUFDcEMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQztRQUVoRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQ0FBa0M7WUFDaEYsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDBDQUEwQyxFQUFFLENBQUMsQ0FBQztRQUMzRSxDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUM7WUFDN0MsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLGdCQUFnQjtZQUMvQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQztZQUM5QyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO2dCQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO2FBQzVCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ3pCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSwwQkFBMEI7WUFDekQsRUFBRSxFQUFFLEtBQUs7WUFDVCxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLElBQUksRUFBRTs7O21CQUdPLFFBQVE7O09BRXBCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdkYsQ0FBQztBQUNILENBQUMifQ==