import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const customerService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER);

  try {
    const customers = await customerService.listCustomers({ email });
    
    if (customers.length === 0) {
      return res.json({ message: "If email exists, reset link will be sent" });
    }

    const customer = customers[0];
    const token = jwt.sign(
      { customer_id: customer.id, email: customer.email },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );

    const resetUrl = `${process.env.STORE_CORS?.split(',')[0]}/reset-password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    res.status(500).json({ message: "Failed to process request", error: error.message });
  }
}
