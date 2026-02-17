"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function POST(req, res) {
    try {
        const { type, productTitle, productId, metal, size, productImage, timestamp } = req.body;
        // Check if email sending is enabled
        const emailEnabled = process.env.EMAIL_ENABLED === 'true' || process.env.EMAIL_ENABLED === 'on';
        if (!emailEnabled) {
            console.log('Email sending is disabled. Skipping enquiry email.');
            return res.json({ success: true, message: 'Email sending disabled (simulated success)' });
        }
        // Configure email transporter
        const transporter = nodemailer_1.default.createTransport({
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
              <p><strong>Enquiry Time:</strong> ${timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</p>
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
    }
    catch (error) {
        console.error('Enquiry email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NlbmQtZW5xdWlyeS1lbWFpbC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLG9CQStGQztBQWpHRCw0REFBb0M7QUFFN0IsS0FBSyxVQUFVLElBQUksQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQ2hFLElBQUksQ0FBQztRQUNILE1BQU0sRUFDSixJQUFJLEVBQ0osWUFBWSxFQUNaLFNBQVMsRUFDVCxLQUFLLEVBQ0wsSUFBSSxFQUNKLFlBQVksRUFDWixTQUFTLEVBQ1YsR0FBRyxHQUFHLENBQUMsSUFRUCxDQUFDO1FBRUYsb0NBQW9DO1FBQ3BDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUM7UUFFaEcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0RBQW9ELENBQUMsQ0FBQztZQUNsRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSw0Q0FBNEMsRUFBRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUVELDhCQUE4QjtRQUM5QixNQUFNLFdBQVcsR0FBRyxvQkFBVSxDQUFDLGVBQWUsQ0FBQztZQUM3QyxPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHNCQUFzQjtnQkFDdEQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLG1CQUFtQjthQUN4RDtTQUNGLENBQUMsQ0FBQztRQUVILHNCQUFzQjtRQUN0QixNQUFNLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQXdCTixZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsWUFBWSxVQUFVLFlBQVkscUdBQXFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7OzZDQUUzSSxZQUFZO2dEQUNULFNBQVM7b0RBQ0wsS0FBSzttREFDTixJQUFJO2tEQUNMLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUs7Ozs7Ozs7Ozs7OztLQVlyRyxDQUFDO1FBRUYsNkJBQTZCO1FBQzdCLE1BQU0sV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUN6QixJQUFJLEVBQUUsMkJBQTJCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO1lBQzFELEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7WUFDckQsT0FBTyxFQUFFLHFCQUFxQixZQUFZLEVBQUU7WUFDNUMsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0FBQ0gsQ0FBQyJ9