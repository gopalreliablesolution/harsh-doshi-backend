import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Button } from "@medusajs/ui"

// Print Invoice Widget for Order Details Page
const OrderInvoiceWidget = ({ data }: { data: any }) => {

  const order = data

  const handlePrintInvoice = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
      alert('Please allow popups to print the invoice')
      return
    }

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(order)

    printWindow.document.write(invoiceHTML)
    printWindow.document.close()

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

  const generateInvoiceHTML = (order: any) => {
    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const shippingAddress = order.shipping_address || {}
    const billingAddress = order.billing_address || shippingAddress
    const customer = order.customer || {}
    const currency = order.currency_code?.toUpperCase() || 'INR'
    const currencySymbol = currency === 'INR' ? '₹' : currency + ' '

    // Calculate totals from order data
    const subtotal = order.item_total || order.items?.reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0) || 0
    const tax = order.tax_total || 0
    const shipping = order.shipping_total || 0
    const discount = order.discount_total || 0
    const total = order.total || (subtotal + tax + shipping - discount)


    const formatAmount = (amount: number) => {

      return `${currencySymbol}${amount.toFixed(2)}`
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.display_id || order.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            color: #111827;
            line-height: 1.5;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 48px;
            padding-bottom: 24px;
            border-bottom: 1px solid #E5E7EB;
          }
          .company-info h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
          }
          .company-info p {
            color: #4B5563;
            font-size: 14px;
          }
          .invoice-meta {
            text-align: right;
          }
          .invoice-meta h2 {
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 12px;
            color: #111827;
          }
          .invoice-meta p {
            font-size: 14px;
            margin: 2px 0;
            color: #4B5563;
          }
          .addresses {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin: 32px 0;
          }
          .address-block h3 {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 12px;
            color: #6B7280;
            letter-spacing: 0.05em;
          }
          .address-block p {
            font-size: 14px;
            margin: 2px 0;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 32px 0;
          }
          .items-table th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #6B7280;
            border-bottom: 1px solid #E5E7EB;
            letter-spacing: 0.05em;
          }
          .items-table td {
            padding: 16px 12px;
            font-size: 14px;
            border-bottom: 1px solid #F3F4F6;
          }
          .items-table .text-right {
            text-align: right;
          }
          .items-table .font-medium {
            font-weight: 500;
          }
          .totals {
            margin-left: auto;
            width: 280px;
            margin-top: 24px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 14px;
            color: #4B5563;
          }
          .total-row.final {
            border-top: 1px solid #E5E7EB;
            margin-top: 12px;
            padding-top: 12px;
            font-weight: 700;
            font-size: 18px;
            color: #111827;
          }
          .footer {
            margin-top: 80px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              <h1>Harssh Doshi</h1>
              <p>Luxury Jewellery</p>
              <p>India</p>
            </div>
            <div class="invoice-meta">
              <h2>INVOICE</h2>
              <p><strong>Order ID:</strong> ${order.display_id || order.id}</p>
              <p><strong>Date:</strong> ${orderDate}</p>
              <p><strong>Status:</strong> ${order.status || 'Registered'}</p>
            </div>
          </div>

          <div class="addresses">
            <div class="address-block">
              <h3>Billed To</h3>
              <p><strong>${billingAddress.first_name} ${billingAddress.last_name}</strong></p>
              <p>${billingAddress.address_1 || ''}</p>
              ${billingAddress.address_2 ? `<p>${billingAddress.address_2}</p>` : ''}
              <p>${billingAddress.city || ''}, ${billingAddress.province || ''} ${billingAddress.postal_code || ''}</p>
              <p>${billingAddress.country_code?.toUpperCase() || ''}</p>
              ${customer.email ? `<p>${customer.email}</p>` : ''}
              ${billingAddress.phone ? `<p>${billingAddress.phone}</p>` : ''}
            </div>
            <div class="address-block">
              <h3>Shipped To</h3>
              <p><strong>${shippingAddress.first_name} ${shippingAddress.last_name}</strong></p>
              <p>${shippingAddress.address_1 || ''}</p>
              ${shippingAddress.address_2 ? `<p>${shippingAddress.address_2}</p>` : ''}
              <p>${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postal_code || ''}</p>
              <p>${shippingAddress.country_code?.toUpperCase() || ''}</p>
              ${shippingAddress.phone ? `<p>${shippingAddress.phone}</p>` : ''}
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `

                <tr>
                  <td>
                    <div class="font-medium">${item.title || 'Product'}</div>
                    ${item.variant_title ? `<div style="font-size: 12px; color: #6B7280; margin-top: 2px;">${item.variant_title}</div>` : ''}
                  </td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${formatAmount(item.unit_price)}</td>
                  <td class="text-right font-medium">${formatAmount(item.unit_price * item.quantity)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4" class="text-center">No items</td></tr>'}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${formatAmount(subtotal)}</span>
            </div>
            ${shipping > 0 ? `
              <div class="total-row">
                <span>Shipping</span>
                <span>${formatAmount(shipping)}</span>
              </div>
            ` : ''}
            ${tax > 0 ? `
              <div class="total-row">
                <span>Tax</span>
                <span>${formatAmount(tax)}</span>
              </div>
            ` : ''}
            ${discount > 0 ? `
              <div class="total-row">
                <span>Discount</span>
                <span>-${formatAmount(discount)}</span>
              </div>
            ` : ''}
            <div class="total-row final">
              <span>Total</span>
              <span>${formatAmount(total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase from Harssh Doshi Luxury Jewellery.</p>
            <p>For any inquiries, please contact us at support@harsshdoshi.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }


  return (
    <Container className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Invoice</h2>
          <p className="text-sm text-gray-600">Generate and print invoice for this order</p>
        </div>
        <Button
          onClick={handlePrintInvoice}
          variant="secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Invoice
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderInvoiceWidget
