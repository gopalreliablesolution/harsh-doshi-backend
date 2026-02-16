import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import nodemailer from "nodemailer";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      orderId,
      customerEmail,
      customerName,
      shippingAddress,
      items,
      total,
      subtotal,
      shippingTotal,
      currency
    } = req.body as {
      orderId?: string;
      customerEmail?: string;
      customerName?: string;
      shippingAddress?: any;
      items?: any[];
      total?: number;
      subtotal?: number;
      shippingTotal?: number;
      currency?: string;
    };

    // Check if email sending is enabled
    const emailEnabled = process.env.EMAIL_ENABLED === 'true' || process.env.EMAIL_ENABLED === 'on';

    if (!emailEnabled) {
      console.log('Email sending is disabled. Skipping order confirmation email.');
      return res.json({ success: true, message: 'Email sending disabled (simulated success)' });
    }

    // Debug logging
    console.log('Email Data Received:', {
      orderId,
      total,
      subtotal,
      shippingTotal,
      currency,
      itemPrices: items?.map((i: any) => ({ title: i.title, price: i.price })) || []
    });

    // Configure email transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });

    // Smart format currency - handles both paise and regular amounts
    const formatPrice = (amount: number) => {
      // Medusa returns amounts in smallest currency unit (paise for INR)
      // So 12345.45 rupees = 1234545 paise
      // We always divide by 100 to convert paise to rupees
      const actualAmount = amount / 100;
      return currency === 'inr'
        ? `₹${actualAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `$${actualAmount.toFixed(2)}`;
    };

    // Format item price (already in regular format from localStorage, not paise)
    const formatItemPrice = (price: any) => {
      if (typeof price === 'string') {
        // If it's already formatted (e.g., "₹10,000.00"), return as is
        return price;
      }
      // If it's a number, format it (already in regular format, not paise)
      return currency === 'inr'
        ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `$${price.toFixed(2)}`;
    };

    // Generate items HTML
    const itemsHtml = (items || []).map((item: any) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <strong>${item.title}</strong><br>
          <small style="color: #666;">Metal: ${item.metal} | Size: ${item.size}</small>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatItemPrice(item.price)}
        </td>
      </tr>
    `).join('');

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HARSSH DOSHI</h1>
            <p>Thank You for Your Purchase!</p>
          </div>
          
          <div class="content">
            <h2>Dear ${customerName},</h2>
            <p>Thank you for your order! We're excited to prepare your beautiful jewelry pieces.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              
              <h4>Items Ordered:</h4>
              <table>
                ${itemsHtml}
              </table>
              
              <h4>Shipping Address:</h4>
              <p>
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br>
                ${shippingAddress.country}<br>
                Phone: ${shippingAddress.phone}
              </p>
            </div>
            
            <p>We will send you a shipping confirmation email once your order is on its way.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Harssh Doshi. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: `"Harssh Doshi" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: emailHtml
    });

    // Send notification to admin
    await transporter.sendMail({
      from: `"Harssh Doshi" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Order Received - ${orderId}`,
      html: `
        <h2>New Order Notification</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p>Please check your admin panel for full details.</p>
      `
    });

    res.json({ success: true, message: 'Order confirmation email sent' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
