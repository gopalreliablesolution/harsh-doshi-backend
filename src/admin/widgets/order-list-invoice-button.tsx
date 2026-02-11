import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button } from "@medusajs/ui"

// Print Invoice Button for Order List Page
const OrderListInvoiceWidget = ({ data }: { data: any }) => {
  const order = data

  const handlePrintInvoice = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      alert('Please allow popups to print the invoice')
      return
    }

    const invoiceHTML = generateInvoiceHTML(order)
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
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

    const subtotal = order.item_total || 0
    const tax = order.tax_total || 0
    const shipping = order.shipping_total || 0
    const discount = order.discount_total || 0
    const total = order.total || 0

    const formatAmount = (amount: number) => {
      return `${currencySymbol}${(amount / 100).toFixed(2)}`
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.display_id || order.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #000; }
          .company-info h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .invoice-meta { text-align: right; }
          .invoice-meta h2 { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
          .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 32px 0; }
          .address-block h3 { font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; color: #666; }
          .items-table { width: 100%; border-collapse: collapse; margin: 32px 0; }
          .items-table th { padding: 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #666; border-bottom: 2px solid #000; }
          .items-table td { padding: 16px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 280px; margin-top: 24px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .total-row.final { border-top: 2px solid #000; margin-top: 12px; padding-top: 12px; font-weight: 700; font-size: 18px; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              <h1>HARSSH DOSHI</h1>
              <p>Luxury Jewellery</p>
            </div>
            <div class="invoice-meta">
              <h2>INVOICE</h2>
              <p><strong>Order:</strong> #${order.display_id || order.id}</p>
              <p><strong>Date:</strong> ${orderDate}</p>
            </div>
          </div>

          <div class="addresses">
            <div class="address-block">
              <h3>Billed To</h3>
              <p><strong>${billingAddress.first_name || ''} ${billingAddress.last_name || ''}</strong></p>
              <p>${billingAddress.address_1 || ''}</p>
              <p>${billingAddress.city || ''}, ${billingAddress.province || ''} ${billingAddress.postal_code || ''}</p>
              <p>${customer.email || ''}</p>
            </div>
            <div class="address-block">
              <h3>Shipped To</h3>
              <p><strong>${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}</strong></p>
              <p>${shippingAddress.address_1 || ''}</p>
              <p>${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postal_code || ''}</p>
              <p>${shippingAddress.phone || ''}</p>
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
                  <td><strong>${item.title || 'Product'}</strong></td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${formatAmount(item.unit_price)}</td>
                  <td class="text-right">${formatAmount(item.unit_price * item.quantity)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">No items</td></tr>'}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${formatAmount(subtotal)}</span>
            </div>
            ${shipping > 0 ? `<div class="total-row"><span>Shipping</span><span>${formatAmount(shipping)}</span></div>` : ''}
            ${tax > 0 ? `<div class="total-row"><span>Tax</span><span>${formatAmount(tax)}</span></div>` : ''}
            ${discount > 0 ? `<div class="total-row"><span>Discount</span><span>-${formatAmount(discount)}</span></div>` : ''}
            <div class="total-row final">
              <span>Total</span>
              <span>${formatAmount(total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase from Harssh Doshi Luxury Jewellery.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  return (
    <Button
      onClick={handlePrintInvoice}
      variant="transparent"
      size="small"
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
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    </Button>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrderListInvoiceWidget
