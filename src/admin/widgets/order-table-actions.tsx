import { defineWidgetConfig } from "@medusajs/admin-sdk"

// This adds a "Print Invoice" action to each order row in the order list
const OrderTableActions = ({ data }: { data: any }) => {
  const order = data

  const handlePrintInvoice = () => {
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
    const email = order.email || customer.email || ''
    const currency = order.currency_code?.toUpperCase() || 'INR'
    const currencySymbol = currency === 'INR' ? '₹' : '$'

    const subtotal = order.item_total || order.subtotal || 0
    const tax = order.tax_total || 0
    const shipping = order.shipping_total || 0
    const discount = order.discount_total || 0
    const total = order.total || 0

    const formatAmount = (amount: number) => {
      return `${currencySymbol}${(amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - Order #${order.display_id || order.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #000; }
          .company h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
          .company p { font-size: 14px; color: #666; }
          .invoice-info { text-align: right; }
          .invoice-info h2 { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
          .invoice-info p { font-size: 14px; margin: 4px 0; }
          .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0; }
          .address h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 12px; letter-spacing: 1px; }
          .address p { font-size: 14px; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin: 40px 0; }
          th { padding: 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666; border-bottom: 2px solid #000; letter-spacing: 1px; }
          td { padding: 16px 12px; font-size: 14px; border-bottom: 1px solid #eee; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
          .total-row.final { border-top: 2px solid #000; margin-top: 16px; padding-top: 16px; font-weight: 700; font-size: 20px; }
          .footer { margin-top: 80px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company">
              <h1>HARSSH DOSHI</h1>
              <p>Luxury Jewellery</p>
              <p>India</p>
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Order #${order.display_id || order.id}</strong></p>
              <p>Date: ${orderDate}</p>
              <p>Status: ${order.status || 'Pending'}</p>
            </div>
          </div>

          <div class="addresses">
            <div class="address">
              <h3>Bill To</h3>
              <p><strong>${billingAddress.first_name || ''} ${billingAddress.last_name || ''}</strong></p>
              <p>${billingAddress.address_1 || ''}</p>
              ${billingAddress.address_2 ? `<p>${billingAddress.address_2}</p>` : ''}
              <p>${billingAddress.city || ''}, ${billingAddress.province || ''} ${billingAddress.postal_code || ''}</p>
              <p>${billingAddress.country_code?.toUpperCase() || ''}</p>
              ${email ? `<p>${email}</p>` : ''}
              ${billingAddress.phone ? `<p>Tel: ${billingAddress.phone}</p>` : ''}
            </div>
            <div class="address">
              <h3>Ship To</h3>
              <p><strong>${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}</strong></p>
              <p>${shippingAddress.address_1 || ''}</p>
              ${shippingAddress.address_2 ? `<p>${shippingAddress.address_2}</p>` : ''}
              <p>${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postal_code || ''}</p>
              <p>${shippingAddress.country_code?.toUpperCase() || ''}</p>
              ${shippingAddress.phone ? `<p>Tel: ${shippingAddress.phone}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `
                <tr>
                  <td>
                    <strong>${item.title || 'Product'}</strong>
                    ${item.variant?.title ? `<br><small style="color: #666;">${item.variant.title}</small>` : ''}
                  </td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${formatAmount(item.unit_price)}</td>
                  <td class="text-right"><strong>${formatAmount(item.unit_price * item.quantity)}</strong></td>
                </tr>
              `).join('') || '<tr><td colspan="4" style="text-align: center;">No items</td></tr>'}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatAmount(subtotal)}</span>
            </div>
            ${shipping > 0 ? `
              <div class="total-row">
                <span>Shipping:</span>
                <span>${formatAmount(shipping)}</span>
              </div>
            ` : ''}
            ${tax > 0 ? `
              <div class="total-row">
                <span>Tax:</span>
                <span>${formatAmount(tax)}</span>
              </div>
            ` : ''}
            ${discount > 0 ? `
              <div class="total-row">
                <span>Discount:</span>
                <span>-${formatAmount(discount)}</span>
              </div>
            ` : ''}
            <div class="total-row final">
              <span>TOTAL:</span>
              <span>${formatAmount(total)}</span>
            </div>
          </div>

          <div class="footer">
            <p><strong>Thank you for your purchase!</strong></p>
            <p>Harssh Doshi Luxury Jewellery | www.harsshdoshi.com</p>
            <p>For inquiries: info@harsshdoshi.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  return {
    label: "Print Invoice",
    onClick: handlePrintInvoice,
  }
}

export const config = defineWidgetConfig({
  zone: "order.list.table.actions",
})

export default OrderTableActions
