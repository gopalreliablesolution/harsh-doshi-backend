"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function POST(req, res) {
    try {
        const { orderId, customerEmail, customerName, shippingAddress, items, total, subtotal, shippingTotal, currency } = req.body;
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
            itemPrices: items?.map((i) => ({ title: i.title, price: i.price })) || []
        });
        // Configure email transporter (Gmail example)
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password'
            }
        });
        // Smart format currency - handles both paise and regular amounts
        const formatPrice = (amount) => {
            // Medusa returns amounts in smallest currency unit (paise for INR)
            // So 12345.45 rupees = 1234545 paise
            // We always divide by 100 to convert paise to rupees
            const actualAmount = amount / 100;
            return currency === 'inr'
                ? `₹${actualAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `$${actualAmount.toFixed(2)}`;
        };
        // Format item price (already in regular format from localStorage, not paise)
        const formatItemPrice = (price) => {
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
        const itemsHtml = (items || []).map((item) => `
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
    }
    catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NlbmQtb3JkZXItZW1haWwvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxvQkErS0M7QUFqTEQsNERBQW9DO0FBRTdCLEtBQUssVUFBVSxJQUFJLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUNoRSxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQ0osT0FBTyxFQUNQLGFBQWEsRUFDYixZQUFZLEVBQ1osZUFBZSxFQUNmLEtBQUssRUFDTCxLQUFLLEVBQ0wsUUFBUSxFQUNSLGFBQWEsRUFDYixRQUFRLEVBQ1QsR0FBRyxHQUFHLENBQUMsSUFVUCxDQUFDO1FBRUYsb0NBQW9DO1FBQ3BDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUM7UUFFaEcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0RBQStELENBQUMsQ0FBQztZQUM3RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSw0Q0FBNEMsRUFBRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFO1lBQ2xDLE9BQU87WUFDUCxLQUFLO1lBQ0wsUUFBUTtZQUNSLGFBQWE7WUFDYixRQUFRO1lBQ1IsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFO1NB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