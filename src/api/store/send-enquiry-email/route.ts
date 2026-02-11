import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import nodemailer from "nodemailer";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      type,
      productTitle,
      productId,
      metal,
      size,
      productImage,
      timestamp
    } = req.body;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });

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
          .product-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HARSSH DOSHI</h1>
            <p>New Product Enquiry</p>
          </div>
          
          <div class="content">
            <h2>Product Enquiry Details</h2>
            
            <div class="product-details">
              ${productImage ? `<img src="${productImage}" alt="${productTitle}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : ''}
              
              <p><strong>Product:</strong> ${productTitle}</p>
              <p><strong>Product ID:</strong> ${productId}</p>
              <p><strong>Selected Metal:</strong> ${metal}</p>
              <p><strong>Selected Size:</strong> ${size}</p>
              <p><strong>Enquiry Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            </div>
            
            <p>A customer has shown interest in this product. Please follow up accordingly.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Harssh Doshi. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send notification to admin
    await transporter.sendMail({
      from: `"Harssh Doshi Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Product Enquiry - ${productTitle}`,
      html: emailHtml
    });

    res.json({ success: true, message: 'Enquiry email sent to admin' });
  } catch (error) {
    console.error('Enquiry email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
